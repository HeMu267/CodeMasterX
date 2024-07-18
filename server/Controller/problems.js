const Problem=require("../Models/problem");
const User=require("../Models/user");
const DefaultCode=require("../Models/default-code");
exports.getAllProblems=async(req,res)=>{
    const problems=await Problem.find();
    return res.status(200).json({
        message:"problems fetched",
        problems:problems
    })
}
exports.getProblem=async(req,res)=>{
    const userId=req.user.id;
    const user=await User.findById({_id:userId});
    if(!user)
    {
        return res.status(400).json({
            message:"user not found"
        });
    }
    const id=req.query.id;
    const problem=await Problem.findById({
        _id:id
    }).populate(
        'defaultCode'
    ).exec();
    if(!problem)
    {
        return res.status(400).json({
            message:"problem not found"
        });
    }
    return res.status(200).json({
        message:"problem fetched",
        problem:problem
    })
}