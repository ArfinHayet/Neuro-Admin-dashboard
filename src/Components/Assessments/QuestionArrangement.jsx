import React from "react";

const QuestionArrangement = ({ question, index, onChange }) => {
  const handleOrderChange = (e) => {
    onChange(question.id, "order", parseInt(e.target.value));
  };

  const handleAnswerTypeChange = (e) => {
    onChange(question.id, "answerType", e.target.value);
  };

  return (
    <tr className="border-b">
      <td className="p-2">{index + 1}</td>
      <td className="p-2">{question.question}</td>
      <td className="p-2">
        <input
          type="number"
          value={question.order}
          onChange={handleOrderChange}
          className="border w-12 p-1 rounded text-center"
          min={1}
        />
      </td>
      <td className="p-2">
        <select
          value={question.answerType}
          onChange={handleAnswerTypeChange}
          className="border p-1 rounded w-fit"
        >
          <option value="yesno">Yes/No</option>
          <option value="text">Text</option>
          <option value="multiple">Multiple Choice</option>
        </select>
      </td>
      <td className="p-2 space-x-2">
        <button className="text-blue-600">Edit</button>
        <button className="text-red-600">Delete</button>
      </td>
    </tr>
  );
};

export default QuestionArrangement;
