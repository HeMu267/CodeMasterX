const User=require("../Models/user");
const OTP=require("../Models/otp");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const otpGenerator=require("otp-generator");
require("dotenv").config();
exports.sendOTP=async(req,res)=>{
    try{
        const {email}=req.body;
        const checkUserPresent=await User.findOne({email});
        if(checkUserPresent)
        {
            return res.status(401).json({
                success:false,
                message:"User already exist"
            })
        }
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        var result=await OTP.findOne({otp:otp});
        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result=await OTP.findOne({otp:otp});
        }
        await OTP.create({email,otp});
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
        })

    }
    catch(err)
    {
        console.log("Error in sending OTP");
        console.log(err);
        console.log(err.message);
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
exports.signUp=async(req,res)=>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp
        }=req.body;
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            });
        }
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword should be same"
            });
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registered please login"
            });
        } 
        const recentOTP=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        if(recentOTP.length===0)
        {
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }else if(otp!==recentOTP[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invalid otp"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        return res.status(200).json({
            success:true,
            message:"User is registered",
            user
        })
    }
    catch(err)
    {
        console.log("Error in signing in");
        console.log(err);
        console.log(err.message);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered"
        })
    }
}
exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"Please fill all details"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not present"
            });
        }
        
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"100d"
            });
            const payload1={
                id:user._id
            }
            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            })
        }
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login failure,please try again"
        })

    }
}
