const fs=require("fs").promises;
const MOUNT_PATH=process.env.MOUNT_PATH;
exports.getProblem=async(problemId,languageId)=>
{
    const fullBoilerplateCode=await getProblemFullBoilerplateCode(problemId,languageId);
    const inputs=await getProblemInputs(problemId);
    const outputs=await getProblemOutputs(problemId);
    return {
        id:problemId,
        fullBoilerplateCode:fullBoilerplateCode,
        inputs:inputs,
        outputs:outputs
    }
}
const getProblemFullBoilerplateCode=async(problemId,languageId)=>
{
    try{
        const filePath = `${MOUNT_PATH}/${problemId}/boilerplate-full/function.${languageId}`;
        const data=await fs.readFile(filePath,{encoding:"utf8"});
        return data;
    }catch(err)
    {
        throw err;
    }
}
const getProblemInputs = async (problemId) => {
    const dirPath = `${MOUNT_PATH}/${problemId}/tests/inputs`;
    try {
      const files = await fs.readdir(dirPath);
      const data = await Promise.all(
        files.map(file => fs.readFile(`${dirPath}/${file}`, { encoding: 'utf8' }))
      );
      return data;
    } catch (err) {
      throw err;
    }
};
const getProblemOutputs = async (problemId) => {
    const dirPath = `${MOUNT_PATH}/${problemId}/tests/outputs`;
    try {
      const files = await fs.readdir(dirPath);
      const data = await Promise.all(
        files.map(file => fs.readFile(`${dirPath}/${file}`, { encoding: 'utf8' }))
      );
      return data;
    } catch (err) {
      throw err;
    }
};
