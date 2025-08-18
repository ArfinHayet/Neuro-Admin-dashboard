import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//import { assessments, onDemandAssessments } from "../../Components/utils/Data";
import { getSubmissions, getAnswers } from "../../api/submissionanswers";

const tabs = [
  { id: "questions", label: "Questions and Answers" },
  { id: "aisummary", label: "AI Summary" },
];

const OnDemandDetails = () => {
  const { assessmentId } = useParams();
  const [activeTab, setActiveTab] = useState("questions");
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);

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

  useEffect(() => {
    fetchAssessmentDetails();
  }, [assessmentId]);

  if (!assessment) return <p>Assessment not found.</p>;

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <h1 className="text-xl font-semibold mb-4">
          {assessment.name} Details
        </h1>

        <div className="flex gap-8 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 font-medium text-sm ${
                activeTab === tab.id
                  ? "text-primary font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          ))}
        </div>

        {activeTab === "questions" && (
          <table className="w-full bg-white  border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300">Question</th>
                <th className="p-2 border border-gray-300">Answer</th>
              </tr>
            </thead>
            <tbody>
              {answers.length > 0 ? (
                answers.map((ans, i) => (
                  <tr key={i} className="border border-gray-300">
                    <td className="p-2 border border-gray-300">
                      {ans.questionText}
                    </td>
                    <td className="p-2 border border-gray-300">{ans.answer}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-2 text-center text-gray-500">
                    No answers submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === "aisummary" && (
          <div className="p-4 bg-white  ">
            <p>
              This is a generated AI summary of the assessment results. (You can
              replace this with your AI integration output.)
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OnDemandDetails;
