import React, { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const QuestionArrangement = ({
  question,
  index,
  onChange,
  onEdit,
  onDelete,
}) => {
  const qId = question.id || question._id;
  const [showModal, setShowModal] = useState(false);

  const handleOrderChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onChange(qId, "order", value);
    }
  };

  const handleAnswerTypeChange = (e) => {
    onChange(qId, "answerType", e.target.value);
  };

  const handleDelete = () => {
    onDelete(qId);
    setShowModal(false);
  };

  return (
    <>
      <tr className="border-b bg-white ">
        <td className="pl-4">{index + 1}</td>
        <td className="p-2 text-sm w-[40vw]">
          {question.questions || question.question}
        </td>
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
          <button className="" onClick={() => onEdit(question)}>
            <FiEdit3 className="text-gray-500" size={18} />
          </button>
          <button className="" onClick={() => setShowModal(true)}>
            <MdDeleteOutline className="text-gray-500" size={20} />
          </button>
        </td>
      </tr>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-sm mb-4">
              Are you sure you want to delete this question?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-80 text-sm"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionArrangement;
