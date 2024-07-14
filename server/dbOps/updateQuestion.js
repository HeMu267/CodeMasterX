const Problem=require("../Models/problem");
const DefaultCode=require("../Models/default-code");
const fs=require('fs');
const {LANG_MAPPING}=require("../common/languageMapping");
const {ConnectDB}=require("../Config/database");
const { default: mongoose } = require("mongoose");
const readFileSys=async(path)=>{
    try{
        const data=await fs.promises.readFile(path,"utf8");
        return data;
    }catch(err)
    {
        console.log(err);
    }
}

async function main(problemSlug)
{
    ConnectDB();
    const problemStatement=await readFileSys(`${process.env.MOUNT_PATH}/${problemSlug}/Problem.md`);
    const problem=await Problem.findOneAndUpdate(
            {slug:problemSlug},
            {
                title:problemSlug,
                slug:problemSlug,
                description:problemStatement
            },
            {
                new:true,
                upsert:true,
            }
    )
    await Promise.all(Object.keys(LANG_MAPPING).map(async(lang)=>{
        const code=await readFileSys(`${process.env.MOUNT_PATH}/${problemSlug}/boilerplate/function.${lang}`);
        await DefaultCode.findOneAndUpdate(
            {
                languageId:LANG_MAPPING[lang].internal,
                problemId:problem._id
            },
            {
                problemId:problem._id,
                languageId:LANG_MAPPING[lang].internal,
                code:code
            },{
                new:true,
                upsert:true,
            }
        )
    }))
    await mongoose.disconnect();
}
main(process.argv[2]);
