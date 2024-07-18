import React from 'react';
import ReactMarkdown from 'react-markdown';

const MyMarkdownComponent = ({ markdownText }) => {
  return (
    <div className="markdown-container p-10 border-solid border-2 m-10 rounded-lg bg-gray-100 prose prose-blue">
      <ReactMarkdown>{markdownText}</ReactMarkdown>
    </div>
  );
};

export default MyMarkdownComponent;
