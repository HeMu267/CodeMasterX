const mongoose=require("mongoose");
const defaultCodeSchema=new mongoose.Schema({
    languageId:{
        type:Number,
        required:true,
    },
    problemId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Problem"
    },
    code:{
        type:String,
        required:true
    }
})
defaultCodeSchema.index({
    problemId:1,
    languageId:1
},{
    unique:true
})
module.exports=mongoose.model("DefaultCode",defaultCodeSchema)