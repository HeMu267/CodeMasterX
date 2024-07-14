const mongoose=require("mongoose");
const languageSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    judge0Id:{
        type:Number,
        required:true,
        unique:true
    },
    defaultCode:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"DefaultCode"
        }
    ]
}
)
module.exports=mongoose.model("Language",languageSchema)