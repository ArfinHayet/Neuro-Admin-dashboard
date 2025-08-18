/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
//import { initialQuestions } from "../../../Components/utils/Data";
import QuestionArrangement from "../../../Components/Common/QuestionArrangement";
import InitialModal from "../../../Components/Assessments/InitialModal";
import {
  // getQuestionsByAssessmentId,
  deleteQuestion,
  getAllQuestions,
} from "../../../api/questionnaires";

const InitialAssessment = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await getAllQuestions();
      console.log("lll",data?.payload)// assessmentId = 1
      setQuestions(data?.payload);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  const handleSave = (newQ) => {
    if (editingQuestion) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion.id ? { ...q, ...newQ } : q))
      );
      setEditingQuestion(null);
    } else {
      setQuestions((prev) => [...prev, newQ]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Failed to delete question", err);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-semibold ">Initial Assessments</h2>
        <button
          className="bg-[#114654] text-white px-4 py-2 rounded-full text-sm"
          onClick={() => {
            setEditingQuestion(null);
            setIsModalOpen(true);
          }}
        >
          Add Question
        </button>
      </div>
      <p className="text-xs text-secondary">
        View, Edit and manage questions for the Initial Assessment to ensure  accuracy and relevance.
      </p>

      <h3 className="font-medium my-3">Question List</h3>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-[#f3f1f1] font-light">
          <tr>
            <th className="pl-4">#</th>
            <th className="p-2">Question</th>
            <th className="p-2">Order</th>
            <th className="p-2">Answer Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions?.map((q, i) => (
            <QuestionArrangement
              key={q.id}
              index={i}
              question={q}
              onChange={(id, field, value) => {
                setQuestions((prev) =>
                  prev.map((ques) =>
                    ques.id === id ? { ...ques, [field]: value } : ques
                  )
                );
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>

      <InitialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        defaultType="initial"
        editingQuestion={editingQuestion}
        fetchQuestions={fetchQuestions}
      />
    </section>
  );
};

export default InitialAssessment;