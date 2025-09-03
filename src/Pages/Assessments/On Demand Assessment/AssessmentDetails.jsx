/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionArrangement from "../../../Components/Common/QuestionArrangement";
import OnDemandQuestionModal from "../../../Components/Assessments/OnDemandQuestionModal";
import {
  deleteQuestion,
  getQuestionsByAssessmentId,
} from "../../../api/questionnaires";
import { getAssessments } from "../../../api/assessments";

const AssessmentDetails = () => {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const assessmentsResponse = await getAssessments();
      const allAssessments = assessmentsResponse?.payload || [];
      const thisAssessment = allAssessments.find((a) => a.id.toString() === id);

      if (!thisAssessment) {
        setError("Assessment not found");
        setIsLoading(false);
        return;
      }

      setAssessment(thisAssessment);
     console.log(id)
      const questionsResponse = await getQuestionsByAssessmentId(
        thisAssessment.id
      );

      console.log("999",questionsResponse)

      const questionsData = questionsResponse?.payload || [];
      setQuestions(questionsData);
    } catch (err) {
      console.error("Failed to fetch assessment details:", err);
      setError("Failed to load assessment details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
    setIsModalOpen(false);
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

  if (error) {
    return <p> {error} </p>;
  }

  if (isLoading) {
    return (
      <section className="h-[90vh] flex justify-center items-center rounded-2xl px-4 pt-5">
        <p>Loading assessments...</p>
      </section>
    );
  }

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-4 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{assessment?.category}</h2>
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
          {/* View, Edit and manage questions for the On-Demand Assessment to ensure accuracy and relevance. */}
          {assessment?.description}
        </p>
        <p className="mb-1 text-gray-700 text-sm">
          <strong>Duration </strong>
          {assessment?.totalTime || "N/A"}
        </p>
        <p className="mb-4 text-gray-700 text-sm">
          <strong>Price </strong>£{assessment?.priceId || "N/A"}
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
          assessment={assessment}
        />
      </div>
    </section>
  );
};

export default AssessmentDetails;
