import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllSubmissions } from "../../api/submissions";
import { getAnswersByAssessmentId } from "../../api/answers";

const InitialsDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1️⃣ Fetch all submissions
        const submissionsRes = await getAllSubmissions();
        const submissions = submissionsRes.payload || [];
        const thisSubmission = submissions.find(
          (s) => String(s.id) === String(submissionId)
        );

        if (!thisSubmission) {
          setSubmission(null);
          setAnswers([]);
          return;
        }

        setSubmission(thisSubmission);

        // 2️⃣ Fetch answers by patientId and assessmentId
        const patientId = thisSubmission.patient?.id;
        const assessmentId = thisSubmission.assessmentId;

        if (!patientId || !assessmentId) {
          setAnswers([]);
        } else {
          const answersRes = await getAnswersByAssessmentId(
            patientId,
            assessmentId,
            {
              limit: 100, // optional, depends on API
            }
          );
          const fetchedAnswers = answersRes?.payload || [];
          setAnswers(fetchedAnswers);
        }
      } catch (err) {
        console.error("Failed to fetch assessment details:", err);
        setSubmission(null);
        setAnswers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

 if (isLoading) {
   return (
     <section className="h-[90vh] flex flex-col justify-center items-center">
       <div className="custom-loader"></div>
       <p className="mt-4 text-sm text-gray-500">
         Loading Assessment Submissions Details...
       </p>
     </section>
   );
 }

  if (!submission) {
    return (
      <div className="p-6 mx-auto">
        <h2 className="text-xl font-semibold mb-4">Assessment not found.</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-4 pb-14">
      <h1 className="text-xl font-semibold mb-2">
        {submission.assessment?.name || "Assessment"} Details
      </h1>

      {/* Basic info */}
      <div className="text-sm space-y-0.5 pb-0">
        <p>
          <strong>Date Taken </strong>{" "}
          {new Date(submission.createdAt).toLocaleDateString()}
        </p>
       
        <p>
          <strong>Score </strong> {submission.score ?? "N/A"}
        </p>
        <p>
          <strong>User Name </strong> {submission.user?.name || "Unknown"}
        </p>
        <p>
          <strong>Patient Name </strong> {submission.patient?.name || "Unknown"}
        </p>
      </div>

      {/* Questions & answers */}
      <div className="space-y-4">
        {answers.length > 0 ? (
          answers.map((ans, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border-b border-gray-200 p-2  bg-white max-w-4xl"
            >
              <p className="font-medium text-gray-800 text-sm">
                Q{i + 1}. {ans.question?.questions || "No question text"}
              </p>
              <p className="text-gray-500 text-xs">
                <strong>Answer </strong> {ans.answer || "No answer"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl">
            No answers submitted yet for this assessment.
          </p>
        )}
      </div>

     
    </section>
  );
};

export default InitialsDetails;


