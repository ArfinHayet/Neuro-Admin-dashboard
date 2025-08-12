import React  from "react";
import { MdDeleteOutline, MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import QuestionModal from "./QuestionModal";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";


const QuestionArrangement = ({ question, index, onChange, onEdit, onDelete }) => {
  
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
        <button
          className=""
          onClick={() =>{
             onEdit(question);
          } }
        >
          <AiFillEdit className="text-gray-500" size={20}/>
        </button>
        <button className="" onClick={() => onDelete(question.id)}>
          <MdDelete className="text-gray-500" size={20}/>
        </button>
      </td>
    </tr>
  );
};

export default QuestionArrangement;
