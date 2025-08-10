import React from "react";

const QuestionList = ({ questions, onBack }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Assessment Questions</h2>
      <ul className="list-decimal list-inside space-y-2">
        {questions.map((q, index) => (
          <li key={index}>{q}</li>
        ))}
      </ul>
      <button
        onClick={onBack}
        className="mt-6 text-sm px-4 py-2 bg-gray-800 text-white rounded"
      >
        ← Back to Categories
      </button>
    </div>
  );
};

export default QuestionList;
