import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { assessments, initialQuestions } from "../../Components/utils/Data";
import { getAnswers, getSubmissions } from "../../api/submissionanswers";

const InitialsDetails = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetchAssessmentDetails();
  }, [assessmentId]);

  const fetchAssessmentDetails = async () => {
    try {
      const submissions = (await getSubmissions()) || [];
      const thisAssessment = submissions.find(
        (a) => a.id === parseInt(assessmentId)
      );
      if (!thisAssessment) {
        setAssessment(null);
        return;
      }
      setAssessment(thisAssessment);
      const allAnswers = (await getAnswers()) || [];
      const filteredAnswers = allAnswers.filter(
        (a) => a.assessmentId === parseInt(assessmentId)
      );
      setAnswers(filteredAnswers);
    } catch (err) {
      console.error("Failed to fetch assessment details:", err);
    }
  };

  if (!assessment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Assessment not found.</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-white rounded"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-5">
      <h1 className="text-xl font-medium mb-2">{assessment.name}</h1>
      <p className="mb-1 text-sm">
        <strong>Date Taken</strong>{" "}
        {assessment.dateTaken ? assessment.dateTaken.toLocalDateString() : ""}
      </p>
      <p className="mb-6 text-sm">
        <strong>Category</strong> {assessment.category}
      </p>

      <table className="w-full border border-gray-300 text-left bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border border-gray-300">Question</th>
            <th className="p-2 border border-gray-300">Answer</th>
          </tr>
        </thead>
        <tbody>
          {answers.length > 0 ? (
            answers.map((ans) => (
              <tr key={ans.id} className="border border-gray-300 text-xs">
                <td className="p-2 border border-gray-300">
                  {ans.questionText}
                </td>
                <td className="p-2 border border-gray-300">{ans.answer}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-2 text-center text-gray-500">No answer</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default InitialsDetails;
