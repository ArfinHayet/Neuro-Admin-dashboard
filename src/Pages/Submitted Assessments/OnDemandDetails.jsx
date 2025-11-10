import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getAnswersByPatientAndAssessment } from "../../api/answers";

const OnDemandDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const passedSubmission = state?.submission || null;

  const [assessment, setAssessment] = useState(passedSubmission);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnswers = async (patientId, assessmentId) => {
    try {
      const res = await getAnswersByPatientAndAssessment(
        patientId,
        assessmentId
      );
      setAnswers(res?.payload || []);
    } catch (err) {
      console.error("Error fetching answers:", err);
      setAnswers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (passedSubmission) {
      const patientId = passedSubmission.patient?.id;
      const assessmentId = passedSubmission.assessmentId;

      if (patientId && assessmentId) {
        fetchAnswers(patientId, assessmentId);
      } else {
        setIsLoading(false);
      }
    }
  }, [id]);

  if (isLoading)
    return (
      <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
        <div className="flex justify-center items-center h-40">
          <p>Loading assessment details...</p>
        </div>
      </section>
    );

  if (!assessment) return <p>Assessment not found.</p>;

  return (
    <section>
      <h1 className="text-xl font-semibold mb-4">
        {assessment.assessment?.category || "Assessment"} Assessment Submission
        Details
      </h1>

      <div className="text-sm space-y-1">
        <p>
          <span className="font-semibold">User Name: </span>
          {assessment.user?.name}
        </p>
        <p>
          <span className="font-semibold">Patient Name: </span>
          {assessment.patient?.name}
        </p>
        <p>
          <span className="font-semibold">Clinician: </span>
          {assessment.clinicianId ? "Assigned" : "Not assigned"}
        </p>
        <p>
          <span className="font-semibold">Question Type: </span>
          {assessment.questionType}
        </p>
      </div>

      <div className="mt-6 space-y-4">
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

      <div className="p-4 bg-white rounded-md mt-6">
        <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
        <p className="mt-1 text-gray-700 whitespace-pre-line">
          {assessment.summary
            ? assessment.summary.replace(/\*/g, "")
            : "No summary available."}
        </p>
      </div>
    </section>
  );
};

export default OnDemandDetails;

