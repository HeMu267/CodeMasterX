const axios=require("axios");
const {LANG_MAPPING}=require("../common/languageMapping");
const  Problem=require("../Models/problem");
const {submissionInput}=require("../common/zod/submissionInput");
const {SubmissionCallback}=require("../common/zod/submissionCallback");
const { getProblem } = require("../dbOps/problems");
const User=require("../Models/user")
const Submission=require("../Models/submission");
const JUDGE0_URI=process.env.JUDGE0_URI;
const TestCases=require("../Models/test-cases");
const {outputMapping}=require("../common/outputMapping");
const mongoose=require("mongoose");
const {Mutex}=require("async-mutex");

require('dotenv').config();
const mutex=new Mutex();

exports.submitProblem=async(req,res)=>{
    const userId=req.user.id
    
    const user=await User.findById({_id:userId});
    if(!user)
    {
        return res.status(400).json({
            message:"user not found"
        });
    }

    const SubmissionInput=submissionInput.safeParse(req.body);
    if(!SubmissionInput.success)
    {
        return res.status(400).json({
            message:"Invalid input"
        });
    }
    const dbProblem=await Problem.findById(SubmissionInput.data.problemId);
 
    if(!dbProblem)
    {
        return res.status(400).json({
            message:"Problem not found"
        })
    }
    const problem = await getProblem(
        dbProblem.slug,
        SubmissionInput.data.languageId
    );
    problem.fullBoilerplateCode = problem.fullBoilerplateCode.replace(
        "##USER_CODE_HERE##",
        SubmissionInput.data.code
    );
    const response = await axios.post(
        `${JUDGE0_URI}/submissions/batch?base64_encoded=false`,
        {
          submissions: problem.inputs.map((input, index) => ({
            language_id: LANG_MAPPING[SubmissionInput.data.languageId]?.judge0,
            source_code: problem.fullBoilerplateCode.replace(
              "##INPUT_FILE_INDEX##",
              index.toString()
            ),
            expected_output: problem.outputs[index],
            callback_url:process.env.CALLBACK_URL
          })),
        }
    );
    
    const submission=await Submission.create({
        problemId:SubmissionInput.data.problemId,
        userId:userId,
        code:SubmissionInput.data.code
    });
    problem.inputs.map(async(input,index)=>{
        await TestCases.create({
            submissionId:submission._id,
            status:"PENDING",
            judge0id:response.data[index].token,
        })
    })
    return res.status(200).json(
        {
            message:"submisson made",
            id:submission._id
        }
    )
}
exports.callback=async(req,res)=>{
    const parsedBody=SubmissionCallback.safeParse(req.body);
    // console.log("call back called"); 
    if(!parsedBody.success)
    {
        return res.status(403).json({
            message:"invalid input"
        })
    }
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        await mutex.runExclusive(async()=>{
            const Testcase=await TestCases.findOneAndUpdate(
                {
                    judge0id:parsedBody.data.token
                },
                {
                    status:outputMapping[parsedBody.data.status.description],
                    time:Number(parsedBody.data.time),
                    memory:parsedBody.data.memory,
                },{
                    session,new:true
                }
            )
            if(!Testcase)
            {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json(
                    {
                        message:"Test case not found"
                    }
                )
            }
    
            const allTestCases=await TestCases.find({
                submissionId:Testcase.submissionId,
            }).session(session);
            const pendingTestcases=allTestCases.filter(
                (testcase)=>testcase.status==="PENDING"
            )
            const failedTestcases=allTestCases.filter(
                (testcase)=>testcase.status!=="AC"
            )
    
    
            if(pendingTestcases.length===0)
            {
                const isAccepted=(failedTestcases==0);
                const response=await Submission.findByIdAndUpdate(
                    {
                        _id:Testcase.submissionId,
        
                    },
                    {
                        status:isAccepted?"AC":"REJECTED",
                        $push:{
                            testCases:{
                                $each:allTestCases.map(testcase=>testcase._id)
                            }
                        }
                    },{
                        session,
                        new:true
                    }
                );
                if(isAccepted)
                {
                    await Problem.findByIdAndUpdate(
                        {
                            _id:response.problemId
                        },
                        {
                            $inc:{solved:1}
                        },
                        {new:true}
                    );
                }
            }
            await session.commitTransaction();
            session.endSession();
            res.send("Received");

        })
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            message:"interval server error"
        })
    }
}
exports.getSubmission=async(req,res)=>{
    const userId = req.user.id; 

    const user=await User.findById({_id:userId});
    if(!user)
    {
        return res.status(400).json({
            message:"user not found"
        });
    }
  const submissionId = req.query.id;

  if (!submissionId) {
    return res.status(400).json({
      message: "Invalid submission id",
    });
  }

  try {
    const submission = await Submission.findOne({ _id: submissionId, userId });

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    const testCases = await TestCases.find({ submissionId:submissionId });

    return res.status(200).json({
      submission,
      testCases,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
exports.getAllSubmissions=async(req,res)=>{
    const userId=req.user.id;
    const user=await User.findById({_id:userId});
    if(!user)
    {
        return res.status(400).json({
            message:"user not found"
        });
    }
    const problemId=req.query.problemId;
    if(!problemId)
    {
        return res.status(400).json({
            message: "Invalid problem id",
        });
    }
    try {
        const submissions = await Submission.find({
          problemId: problemId,
          userId: userId,
        })
          .populate({
            path:"testCases"
          }) 
          .sort({ createdAt: -1 })
          .limit(10).exec();
          const timeT=[];
            for(let i=0;i<submissions.length;i++)
            {
              let sumTime=0;
              sumTime+=(submissions[i].testCases.reduce((sum,obj)=>(parseFloat(sum+obj.time)),0));
              timeT[i]=sumTime;
        }
        const memoryM=[];
            for(let i=0;i<submissions.length;i++)
            {
              let mem=0;
              mem+=(submissions[i].testCases.reduce((sum,obj)=>(parseFloat(sum+obj.memory)),0));
              memoryM[i]=mem;
        }
        const testPass=[];
            for(let i=0;i<submissions.length;i++)
            {
              let test=0;
              submissions[i].testCases.forEach(testCase => {
                if (testCase.status === "AC") {
                  test++;
                }
              });
              let total=submissions[i].testCases.length;
              testPass[i]={test,total};
            }
        return res.status(200).json({
          submissions,
          timeT,
          memoryM,
          testPass
        });
      } catch (error) {
        return res.status(500).json({
          message: "Server error",
          error: error.message,
        });
    }
}