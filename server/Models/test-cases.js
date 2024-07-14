const mongoose=require("mongoose");
const testCasesSchema=new mongoose.Schema({
    submissionId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Submission"
    },
    status:{
        type:String,
        enum:["PENDING","FAILED","AC","TLE","COMPILATION_ERR"],
        required:true,
        default:"PENDING"
    },
    judge0id:{
        type:String,
        required:true
    },
    time:{
        type:String,
    },
    memory:{
        type:Number,
    },
    
})
module.exports=mongoose.model("TestCases",testCasesSchema)