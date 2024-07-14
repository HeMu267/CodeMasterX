const express=require("express");
const {limiter}=require("../Middleware/rateLimit");
const {auth}=require("../Middleware/auth");
const router=express.Router();
const {
    callback,
    submitProblem,
    getSubmission,
    getAllSubmissions
}=require("../Controller/submission");
router.put("/submission-callback",callback);
router.post("/submitProblem",limiter,auth,submitProblem);
router.get("/getSubmission",auth,getSubmission)
router.get("/getAllSubmission",auth,getAllSubmissions)
module.exports=router;