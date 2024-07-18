import React, { useEffect ,useState} from 'react';
import {apiConnector} from "../services/apiconnector";
import {endpoints} from "../services/endpoints";
import {useParams} from "react-router-dom"
import { CheckIcon, CircleX, ClockIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { styled } from '@mui/system';

const StyledTableContainer = styled(TableContainer)`
  &.MuiPaper-root {
    background-color: #1a202c;
  }
`;
function renderResult(status) {
  switch (status) {
    case "PENDING":
      return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    case "AC":
      return <CheckIcon className="h-6 w-6 text-green-500" />;
    case "REJECTED":
      return <CircleX className="h-6 w-6 text-red-500" />;
    default:
      return <div className="text-gray-500">Runtime Error!</div>;
  }
}
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
    <StyledTableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow className="bg-gray-700">
            <TableCell className="text-white">Submission ID</TableCell>
            <TableCell className="text-white">Result</TableCell>
            <TableCell className="text-white">Test Passed</TableCell>
            <TableCell className="text-white">Time</TableCell>
            <TableCell className="text-white">Memory</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((sub, index) => (
            <TableRow key={sub._id} className="bg-gray-700">
              <TableCell className="text-white">{sub._id}</TableCell>
              <TableCell className="text-white">{renderResult(sub.status)}</TableCell>
              <TableCell className="text-white">{`${test[index].test}/${test[index].total}`}</TableCell>
              <TableCell className="text-white">{timeTaken[index]}</TableCell>
              <TableCell className="text-white">{mem[index]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default SubmissionTable;
