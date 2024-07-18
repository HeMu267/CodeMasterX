import React, { useState } from 'react'
import SubmissionTable from "./SubmissionTable"
import { Editors} from './Editor';
const ProblemSection = ({problem}) => {
    const [activeTab,setActiveTab]=useState("Submit");

  return (
    <div className='flex mt-5 w-[60%] p-5 flex-col'>
        <div className='flex mb-10 gap-10'>
            <button className={`p-2 border-2 bg-gray-700 rounded text-white ${activeTab=="Submit"?"border-slate-200":"border-gray-800"} `} onClick={()=>setActiveTab("Submit")}>Submit</button>
            <button className={`p-2 border-2 bg-gray-700 rounded text-white ${activeTab=="Submission"?"border-slate-200":"border-gray-800"}`} onClick={()=>setActiveTab("Submission")}>Submission</button>
        </div>
        
        {
            activeTab=="Submission" && (
                <SubmissionTable/>
            )
        }
        {
            activeTab=="Submit" &&(
                <Editors problem={problem}/>
            )
        }
        
    </div>
  )
}

export default ProblemSection