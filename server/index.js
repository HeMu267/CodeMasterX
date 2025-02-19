const express=require("express");
const app=express();
const database=require("./Config/database");
const userRoutes=require("./Routes/user")
const submissionRoutes=require("./Routes/submission");
const problemRoutes=require("./Routes/problems");
const cors=require("cors");
const cookieParser=require("cookie-parser");
require('dotenv').config();
const PORT=process.env.PORT;
database.ConnectDB();

app.use(cookieParser());
app.use(express.json());
app.use(cors(
    {
        origin: ["https://code-master-x.vercel.app", "http://13.203.110.89:2358"], // ✅ Add EC2 IP
        credentials: true,
    }
));
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/submission",submissionRoutes);
app.use("/api/v1/problems",problemRoutes);
app.get("/",(req,res)=>{
    return res.json({
            success:true,
            message:"Your server is up and running",
    })
})
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`app is running ${PORT}`);
})