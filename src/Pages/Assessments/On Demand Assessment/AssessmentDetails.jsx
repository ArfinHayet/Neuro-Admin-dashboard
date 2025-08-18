import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { onDemandAssessments } from "../../../Components/utils/Data";
import QuestionArrangement from "../../../Components/Common/QuestionArrangement";
// import { initialQuestions } from "../../../Components/utils/Data";
import OnDemandQuestionModal from "../../../Components/Assessments/OnDemandQuestionModal";
import { deleteQuestion, getAllQuestions } from "../../../api/questionnaires";

const AssessmentDetails = () => {
  const { id } = useParams();
  const assessment = onDemandAssessments.find(
    (item) => item.id.toString() === id
  );

  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await getAllQuestions();
      console.log("lll", data?.payload); // assessmentId = 1
      setQuestions(data?.payload);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  const handleSave = (newQ) => {
    if (editingQuestion) {
      setQuestions((prev) =>
        (prev ?? []).map((q) =>
          q.id === editingQuestion.id ? { ...q, ...newQ } : q
        )
      );
      setEditingQuestion(null);
    } else {
      setQuestions((prev) => [...(prev ?? []), newQ]);
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
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{assessment.name}</h2>
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
        <p className="text-xs text-secondary mb-2">
          View, Edit and manage questions for the On-Demand Assessment to ensure
          accuracy and relevance.
        </p>
        <p className="mb-4 text-gray-700 text-sm">
          <strong>Duration:</strong> {assessment.time}
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
            {questions.map((q, i) => (
              <QuestionArrangement
                key={q.id}
                index={i}
                question={q}
                onChange={(id, field, value) =>
                  setQuestions((prev) =>
                    prev.map((ques) =>
                      ques.id === id ? { ...ques, [field]: value } : ques
                    )
                  )
                }
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        <OnDemandQuestionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSave={handleSave}
          defaultType="ondemand"
          editingQuestion={editingQuestion}
        />
      </div>
    </section>
  );
};

export default AssessmentDetails;
