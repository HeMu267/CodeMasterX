const {z}=require("zod");
const submissionInput=z.object({
    code:z.string(),
    languageId:z.enum(["js","cpp","rs"]),
    problemId:z.string(),
});
module.exports={submissionInput}