import React, { useState } from 'react';

const LanguageSelector = ({language,onSelect}) => {


  return (
    <div className="relative">
      <select
        className="block appearance-none bg-gray-700 border border-gray-900 text-white hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        value={language}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="js">JavaScript</option>
        <option value="cpp">C++</option>
        <option value="rs">Rust</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.293 11.293a1 1 0 011.414 0L10 12.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414 1 1 0 010 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
