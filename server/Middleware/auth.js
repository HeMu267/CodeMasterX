const jwt=require("jsonwebtoken");
require("dotenv").config();
exports.auth=(req,res,next)=>{
    try{
        const token=req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
        if(!token || token==undefined)
        {
            return res.status(401).json({
                success:false,
                message:"token missing"
            })
        }
        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            req.user=payload;
        }
        catch(err)
        {
            const decodedToken=jwt.decode(token);
            if (decodedToken && decodedToken.exp && decodedToken.exp * 1000 < Date.now()) 
            {  
                return res.status(401).json({
                    success:false,
                    message:"token expired"
                })
            }
            console.log("token is invalid");
            console.error(err);
            res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();
    }
    catch(err)
    {
        console.log(err);
        res.status(401).json({
            success:false,
            message:"authorization cannot be done"
        })
    }
};
