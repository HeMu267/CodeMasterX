import React, { useEffect ,useState} from 'react';
import {apiConnector} from "../services/apiconnector";
import {endpoints} from "../services/endpoints";
import {useParams} from "react-router-dom"
const SubmissionTable = () => {
    const [submissions,setSubmission]=useState([])
    const {id}=useParams();
    const [timeTaken,setTimeTaken]=useState([]);
    const [mem,setMem]=useState([]);
    const [test,setTest]=useState([]);
    const getAllSubmissions=async()=>{
        try{    
            const response=await apiConnector("GET",`${endpoints.GET_ALL_SUBMISSION}?problemId=${id}`);
            console.log(response);
            setSubmission(response.data.submissions);
            setTimeTaken(response.data.timeT);
            setMem(response.data.memoryM);
            setTest(response.data.testPass);
        }catch(err)
        {
          console.log(err);
        }
    }
    useEffect(()=>{
        getAllSubmissions();
    },[])
  return (
    <div className="submission-table rounded-lg">
      <table className="table-auto w-full rounded-lg border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Submission ID</th>
            <th className="border border-gray-300 px-4 py-2">Result</th>
            <th className="border border-gray-300 px-4 py-2">Test Passed</th>
            <th className="border border-gray-300 px-4 py-2">Time</th>
            <th className="border border-gray-300 px-4 py-2">Memory</th>
          </tr>
        </thead>
        <tbody>
          {
              submissions.map((sub,index)=>(
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">{sub._id}</th>
                  <th className="border border-gray-300 px-4 py-2">{sub.status}</th>
                  <th className="border border-gray-300 px-4 py-2">{`${test[index].test} / ${test[index].total}`}</th>
                  <th className="border border-gray-300 px-4 py-2">{timeTaken[index]}</th>
                  <th className="border border-gray-300 px-4 py-2">{mem[index]}</th>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionTable;
