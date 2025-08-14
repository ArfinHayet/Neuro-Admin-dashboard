import React  from "react";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const QuestionArrangement = ({ question, index, onChange, onEdit, onDelete }) => {
  
 const handleOrderChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onChange(question.id, "order", value);
    }
  };

  const handleAnswerTypeChange = (e) => {
    onChange(question.id, "answerType", e.target.value);
  };
  return (
    <tr className="border-b bg-white ">
      <td className="pl-4">{index + 1}</td>
      <td className="p-2 text-sm">{question.questions || question.question}</td>
      <td className="p-2">
        <input
          type="number"
          value={question.order || 1}
          onChange={handleOrderChange}
          className="border w-12 p-1 rounded text-center"
          min={1}
        />
      </td>
      <td className="p-2 text-xs">
        <select
          value={question.answerType}
          onChange={handleAnswerTypeChange}
          className="border p-1 rounded w-28 text-xs"
        >
          <option value="yesno">Yes/No</option>
          <option value="text">Text</option>
          <option value="multiple">Multiple Choice</option>
        </select>
      </td>
      <td className="p-2 space-x-2">
        <button
          className=""
          onClick={() =>  onEdit(question) }
        >
          <FiEdit3 className="text-gray-500" size={18}/>
        </button>
        <button className=""   onClick={() => onDelete(question.id)}>
          <MdDeleteOutline className="text-gray-500" size={20}/>
        </button>
      </td>
    </tr>
  );
};

export default QuestionArrangement;
