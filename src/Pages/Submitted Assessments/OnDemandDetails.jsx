import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
      const response = await getAllSubmissions();
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
      console.log(thisAssessment);

      const allAnswers =
        (await getAnswersByAssessmentId(thisAssessment.assessmentId)) || [];
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
      <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
        <div className="flex justify-center items-center h-40">
          <p>Loading assessment details...</p>
        </div>
      </section>
    );
  }

  if (!assessment) return <p>Assessment not found.</p>;

  return (
    <section className=" ">
      <h1 className="text-xl font-semibold mb-4">
        {assessment.assessment?.category || "Assessment"} Assessment Submission
        Details
      </h1>

      <div className="text-sm space-y-1">
        <p>
          <span className="font-semibold">User Name </span>{" "}
          {assessment.user?.name}
        </p>
        <p>
          <span className="font-semibold">Patient Name </span>{" "}
          {assessment.patient?.name}
        </p>
        <p>
          <span className="font-semibold">Clinician </span>{" "}
          {assessment.clinicianId ? "Assigned" : "Not assigned"}
        </p>
        <p>
          <span className="font-semibold">Question Type </span>{" "}
          {assessment.questionType}
        </p>
        <div>
          <span className="font-semibold">Summary </span>
          <div className="border rounded-md p-2 mt-3">
            
            
              <p className="mt-1 text-gray-700 whitespace-pre-line">
                {assessment.summary
                  ? assessment.summary.replace(/\*/g, "") // remove all * characters
                  : "No summary available."}
              </p>
         

            {/* <p className="mt-1 text-gray-700 whitespace-pre-line">
              {assessment.summary || "No summary available."}
            </p> */}
          </div>
        </div>
      </div>

      {/* <div className="flex gap-8 mb-6 border-b border-gray-200">
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
        <div className="space-y-4">
          {answers.length > 0 ? (
            answers.map((ans, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl"
              >
               
                <div>
                  <p className="font-medium text-gray-800">
                    {ans.question?.questions}
                  </p>
                <div className="flex gap-2 items-center">
                 <div className="w-3 h-3 rounded-full bg-primary mt-1"></div>  
                 <p className="text-secondary mt-1">{ans.answer}</p>
                 </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl">
              No answers submitted yet.
            </p>
          )}
        </div>
      )}

      {activeTab === "aisummary" && (
        <div className="p-4 bg-white  ">
          <p>
            {assessment.summary ? assessment.summary : "No summary available."}
          </p>
        </div>

      )} */}
    </section>
  );
};

export default OnDemandDetails;
