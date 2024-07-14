const rateLimit=require("express-rate-limit");
exports.limiter=rateLimit(
    {
        windowMs:10*1000,
        limit:1,
        message:"Too many requests from this IP, please try again after some time."
    }
)