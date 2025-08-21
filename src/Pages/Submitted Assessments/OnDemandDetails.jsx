import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//import { assessments, onDemandAssessments } from "../../Components/utils/Data";
import { getAllSubmissions } from "../../api/submissions";
import { getAnswersByAssessmentId } from "../../api/answers";

const tabs = [
  { id: "questions", label: "Questions and Answers" },
  { id: "aisummary", label: "AI Summary" },
];

const OnDemandDetails = () => {
  const { assessmentId } = useParams();
  const [activeTab, setActiveTab] = useState("questions");
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssessmentDetails = async () => {
    try {
      setIsLoading(true);

      const response = (await getAllSubmissions()) ;
      const submissions = response.payload || []; 
      const thisAssessment = submissions.find(
        (a) => a.assessmentId === parseInt(assessmentId)
      );

      if (!thisAssessment) {
        setAssessment(null);
        setAnswers([]);
        return;
      }

      setAssessment(thisAssessment);

      const allAnswers = await getAnswersByAssessmentId( thisAssessment.assessmentId ) || [];
     setAnswers(allAnswers);
    } catch (err) {
      console.error("Failed to fetch assessment details:", err);
      setAssessment(null);
      setAnswers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessmentDetails();
  }, [assessmentId]);

  if (isLoading) {
    return (
      <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-5">
        <div className="flex justify-center items-center h-40">
          <p>Loading assessment details...</p>
        </div>
      </section>
    );
  }

  if (!assessment) return <p>Assessment not found.</p>;

  return (
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-5">
      <h1 className="text-xl font-semibold mb-6">
        {" "}
        {assessment.assessment?.category || "Assessment"} Details
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
                    {ans.question?.questions}
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
            {assessment.summary ? assessment.summary : "No summary available."}
          </p>
        </div>
      )}
    </section>
  );
};

export default OnDemandDetails;
