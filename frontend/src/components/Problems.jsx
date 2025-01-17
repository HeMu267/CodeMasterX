import React, { useEffect, useState } from "react";  
import { apiConnector } from "../services/apiconnector";
import { endpoints } from "../services/endpoints";
import ProblemCard from "../components/ProblemCard";
export function Problems() {
    const [problems,setProblems]=useState([]);
    const getProblems=async()=>{
        try{
            console.log(endpoints.GET_PROBLEMS);
            const result=await apiConnector("GET",endpoints.GET_PROBLEMS);
            // console.log(result);
            setProblems(result.data.problems);
        }catch(err)
        {
            console.log(err);
            console.log("Could not fetch category list")
        }
    }
    useEffect(()=>{
        getProblems();
    },[])
    return (
      <section className="bg-white dark:bg-gray-900 py-8 md:py-12 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <h2 className="text-2xl text-white font-bold mb-2">Popular Problems</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Check out the most popular programming problems on Code100x.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems && problems.map((problem) => (
              <ProblemCard problem={problem} key={problem._id} />
            ))}
          </div>
        </div>
      </section>
    );
}
  