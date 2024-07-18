import React from 'react'
import { CheckIcon, CircleX, ClockIcon } from "lucide-react";
const RenderTestCases = ({testcases}) => {
    function renderResult(status) {
        switch (status) {
          case "PENDING":
            return <ClockIcon className="h-6 w-6 text-yellow-500" />;
          case "AC":
            return <CheckIcon className="h-6 w-6 text-green-500" />;
          case "FAILED":
            return <CircleX className="h-6 w-6 text-red-500" />;
          default:
            return <div className="text-gray-500">Runtime Error!</div>;
        }
      }
      // console.log(testcases);
  return (
    <div className="grid grid-cols-3 gap-4">
      {testcases.map((testcase, index) => (
        <div key={index} className="border rounded-md">
          <div className="px-2 pt-2 flex justify-center">
            <div className="text-white">Test #{index + 1}</div>
          </div>
          <div className="p-2 flex justify-center">
            {renderResult(testcase.status)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RenderTestCases