import { useState } from "react";
import { initialQuestions } from "../../../Components/utils/Data";
import QuestionArrangement from "../../../Components/Assessments/QuestionArrangement";


const InitialAssessment = () => {
  const [questions, setQuestions] = useState(
    initialQuestions.map((q, idx) => ({
      ...q,
      order: idx + 1,
      answerType: "yesno", // default 
    }))
  );

  const handleQuestionChange = (id, field, value) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, [field]: value } : q
    );
    setQuestions(updated);
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <h2 className="text-3xl font-semibold mb-4">Initial Assessments</h2>

      <div className="flex justify-end mb-3">
        <button className="bg-[#114654] text-white px-4 py-2 rounded-full text-sm">
          Add Question
        </button>
      </div>

      <h3 className="font-medium mb-2">Question List</h3>

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
          {questions
            .sort((a, b) => a.order - b.order)
            .map((q, i) => (
              <QuestionArrangement
                key={q.id}
                index={i}
                question={q}
                onChange={handleQuestionChange}
              />
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default InitialAssessment;
