import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assessments, initialQuestions } from "../../Components/utils/Data";

const InitialsDetails = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const assessment = assessments.find((a) => a.id === parseInt(assessmentId));

  if (!assessment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Assessment not found.</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to List
        </button>
      </div>
    );
  }

 const getAnswer = (questionId) => {
   const ansObj = assessment.answers.find((a) => a.questionId === questionId);
   return ansObj ? ansObj.answer : null;
 };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 ">
      <h1 className="text-2xl font-medium mb-4">{assessment.name}</h1>
      <p className="mb-2">
        <strong>Date Taken</strong> {assessment.dateTaken}
      </p>
      <p className="mb-6">
        <strong>Type</strong> {assessment.type}
      </p>

      <table className="w-full border border-gray-300 text-left bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border border-gray-300">Question</th>
            <th className="p-2 border border-gray-300">Answer</th>
          </tr>
        </thead>
        <tbody>
          {initialQuestions.map(({ id, question }) => (
            <tr key={id} className="border border-gray-300">
              <td className="p-2 border border-gray-300">{question}</td>
              <td className="p-2 border border-gray-300">
                {getAnswer(id) ?? "No answer"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default InitialsDetails;
