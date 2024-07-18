const express=require("express");
const {auth}=require("../Middleware/auth");
const router=express.Router();
const {
    getAllProblems,
    getProblem
}=require("../Controller/problems");
router.get("/getProblem",auth,getProblem)
router.get("/getAllProblems",getAllProblems);
module.exports=router;