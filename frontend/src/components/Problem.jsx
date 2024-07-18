import React from 'react'
import {useParams} from 'react-router-dom'
import { useEffect,useState } from 'react';
import { apiConnector } from '../services/apiconnector';
import { endpoints } from '../services/endpoints';
import { useSelector } from 'react-redux';
import ProblemSection from "./ProblemSection"
import MyMarkdownComponent from './Markdown';
import LoadingSpinner from './Loading';

const Problem = () => {
    const {id}=useParams();
    const [problem, setProblem] = useState(null);
    const {token}=useSelector((state)=>state.auth);
    const getProblem=async()=>{
        const response=await apiConnector("GET",`${endpoints.GET_PROBLEM}?id=${id}`,{token});
        // console.log(response);
        setProblem(response.data.problem);
    }
    useEffect(()=>{
        getProblem();
    },[id])
  return (
    <div className='bg-gray-900 mb-32 w-screen min-h-screen'>
        {
            problem?(
                // <div className='w-full flex'>
                //     <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
                // </div>
                <div className='bg-gray-900 min-h-screen flex justify-between'>
                    <MyMarkdownComponent markdownText={problem.description}></MyMarkdownComponent>
                    <ProblemSection problem={problem}></ProblemSection>
                </div>
            ):(
                <LoadingSpinner/>
            )
        }
    </div>
  )
}

export default Problem