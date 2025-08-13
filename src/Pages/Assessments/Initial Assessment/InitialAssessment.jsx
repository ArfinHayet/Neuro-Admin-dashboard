import { useState } from "react";
import { initialQuestions } from "../../../Components/utils/Data";
import QuestionArrangement from "../../../Components/Common/QuestionArrangement";
import InitialModal from "../../../Components/Assessments/InitialModal";

const InitialAssessment = () => {
  const [questions, setQuestions] = useState(
    initialQuestions.map((q, idx) => ({
      ...q,
      order: idx + 1,
      answerType: "yesno", // default
    }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleSave = (newQ) => {
    if (editingQuestion) {
      // Update existing
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion.id ? { ...q, ...newQ } : q))
      );
      setEditingQuestion(null);
    } else {
      // Add new
      setQuestions((prev) => [
        ...prev,
        {
          id: Date.now(),
          order: prev.length + 1,
          ...newQ,
        },
      ]);
    }
  };

  const handleDelete = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-medium ">Initial Assessments</h2>
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
      <p className="text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>

      <h3 className="font-medium my-3">Question List</h3>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-white">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Question</th>
            <th className="p-2">Order</th>
            <th className="p-2">Answer Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
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
      />
    </section>
  );
};

export default InitialAssessment;
