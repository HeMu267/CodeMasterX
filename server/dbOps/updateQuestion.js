const Problem=require("../Models/problem");
const DefaultCode=require("../Models/default-code");
const fs=require('fs');
const {LANG_MAPPING}=require("../common/languageMapping");
const database=require("../Config/database");
const { mongoose } = require("mongoose");
require("dotenv").config();
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
    await database.ConnectDB();
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
        const defaults=await DefaultCode.findOneAndUpdate(
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
        await Problem.findByIdAndUpdate(
            {
                _id:problem._id
            },{
                $push:{
                    defaultCode:defaults._id
                }
            }
        )
    }))

    await mongoose.disconnect();
}
main(process.argv[2]);
