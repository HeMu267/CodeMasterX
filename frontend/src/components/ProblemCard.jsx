import React from 'react';
import { Link } from 'react-router-dom';
const ProblemCard = ({problem}) => {
  return (
    <div className=" border-2 bg-gray-950 border-solid border-neutral-200 flex flex-col text-white p-6 rounded-lg shadow-lg max-w-xs">
      <h2 className="text-2xl font-bold">{problem.title}</h2>
      <p className="text-sm text-gray-400">Easy problem for Beginner</p>
      <div className="mt-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Difficulty</p>
            <p className="text-lg font-medium">{problem.difficulty}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Solved</p>
            <p className="text-lg font-medium">{problem.solved}</p>
          </div>
        </div>
      </div>
      <Link to={`/problems/${problem._id}`}
        className="mt-6 bg-white text-gray-900 p-2 text-center rounded-lg font-semibold hover:bg-gray-200 transition duration-200"
      >
        View Problem
      </Link>
    </div>
  );
};

export default ProblemCard;
