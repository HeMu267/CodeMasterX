const mongoose=require("mongoose");
require("dotenv").config();

exports.ConnectDB=async()=>{
    await mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("DB connection sucessful")
    })
    .catch((error)=>{
        console.log("DB connection Failed");
        console.log(error);
        console.log(error.message);
        process.exit(1);
    })
}