import React, { useState,useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import LanguageSelector from './LangaugeSelector';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import toast from 'react-hot-toast';
import { endpoints } from '../services/endpoints';
import RenderTestCases from './RenderTestCases';
export const Editors = ({problem}) =>{
    const mapped={
        "js":1,
        "rs":3,
        "cpp":2,
    };
    const mappedEditor={
        "js":"javascript",
        "cpp":"cpp",
        "rs":"rust"
    }
    const submitStatus={
        SUBMIT : "SUBMIT",
        PENDING: "PENDING",
        ACCEPTED : "ACCEPTED",
        FAILED : "FAILED",
    }
    const editorRef=useRef();
    const onMount=(editor)=>{
        editorRef.current=editor;
        editor.focus();
    }
    const navigate=useNavigate();
    const {token}=useSelector((state)=>state.auth);
    const [language,setLanguage]=useState("js");
    const [value,setValue]=useState(()=>{
        const code=problem.defaultCode.filter((codes)=>(codes.languageId==mapped[language]));
        return code[0].code || "";
    });
    const [status,setStatus]=useState(submitStatus.SUBMIT);
    const [testCases,setTestCases]=useState([]);
    const onSelect=(language)=>{
        setLanguage(language);
        let code=problem.defaultCode.filter((codes)=>(codes.languageId==mapped[language]));
        setValue(code[0].code);
    }
    const pollWithBackoff=async(id,retries)=>{
        if (retries === 0) {
            setStatus(submitStatus.SUBMIT);
            toast.error("Not able to get status ");
            return;
          }
      
          const response = await apiConnector("GET",`${endpoints.GET_SUBMISSION}?id=${id}`,{token});
        //   console.log(response);
          if (response.data.submission.status === "PENDING") {
            setTestCases(response.data.testCases);
            await new Promise((resolve) => setTimeout(resolve, 2.5 * 1000));
            pollWithBackoff(id, retries - 1);
          } else {
            if (response.data.submission.status === "AC") {
              setStatus(submitStatus.ACCEPTED);
              setTestCases(response.data.testCases);
              toast.success("Accepted!");
              return;
            } else {
              setStatus(submitStatus.FAILED);
              toast.error("Failed :(");
              setTestCases(response.data.testCases);
              return;
            }
          }
    }
    const submit=async()=>{
        setStatus(submitStatus.PENDING);
        setTestCases((t) => t.map((tc) => ({ ...tc, status: "PENDING" })));
        try{
            // console.log(
            //     {
            //         code: value,
            //         languageId: language,
            //         problemId: problem._id,
            //         token: token,
            //     }
            // )
            const response = await apiConnector("POST",endpoints.SUBMIT_PROBLEM, {
                code: value,
                languageId: language,
                problemId: problem._id,
                token: token,
            });
            // console.log(response);
            pollWithBackoff(response.data.id, 10);
        }catch(err)
        {  
            toast.error("Cannot Process");
            setStatus(submitStatus.SUBMIT);
        }
    }

  return (
    <div className='flex flex-col gap-4'>
        <LanguageSelector language={language} onSelect={onSelect}/>
        <Editor
            height="80vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={value}
            language={mappedEditor[language]}
            value={value}
            onChange={
                (val)=>setValue(val)
            }
            onMount={
                onMount
            }
        />
        <div className='flex justify-between w-full'>
            <button onClick={token?submit:()=>{navigate("/login")}} disabled={status==submitStatus.PENDING} className=' bg-gray-700 rounded h-[60px] text-white p-4 hover:bg-gray-500'>
            {
                token?"Submit":"Login"
            }
            </button>
            <RenderTestCases testcases={testCases}/>
        </div>
    </div>
    )
}
