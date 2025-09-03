import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllSubmissions } from "../../api/submissions";
import { getAllAnswers, getAnswersByAssessmentId } from "../../api/answers";

const InitialsDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [submissionId]);

  const fetchSubmissionDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSubmissions();
      console.log(response);
      const submissions = response.payload || [];
      console.log(" Submissions array:", submissions.map(s => s.id));
console.log(" Looking for submissionId:", submissionId);
      const thisSubmission = submissions.find(
        (s) => String(s.id) === String(submissionId)
      );
      console.log("", thisSubmission);

      if (!thisSubmission) {
        console.warn("No submission found for ID:", submissionId);

        setSubmission(null);
        setAnswers([]);
        return;
      }

      setSubmission(thisSubmission);

      const responses = await getAllAnswers();
      console.log("answers", responses);
      const allAnswers = responses.payload || [];
      const filteredAnswers = allAnswers.filter(
        (a) => String(a.submissionId) === String(submissionId)
      );
      console.log(" answers for this submission:", filteredAnswers);

      setAnswers(filteredAnswers || []);
    } catch (err) {
      console.error("Failed to fetch assessment details:", err);
      setSubmission(null);
      setAnswers([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-5">
        <div className="flex justify-center items-center h-40">
          <p>Loading assessment details...</p>
        </div>
      </section>
    );
  }

  if (!submission) {
    return (
      <div className="p-6  mx-auto">
        <h2 className="text-xl font-semibold mb-4">Assessment not found.</h2>
        <button onClick={() => navigate(-1)} className="p-2">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
      {/* <h1 className="text-xl font-medium mb-2">{assessment.assessment?.name || "Assessment Details"}</h1> */}
      <h1 className="text-xl font-semibold  mb-0"> Assessment Details</h1>

      <div className="flex flex-col gap-2 justify-start mb-6">
        <p className=" text-sm">
          <strong>Date Taken </strong>
          {new Date(submission.createdAt).toLocaleDateString()}
        </p>
        <p className=" text-sm">
          <strong>Category </strong> {submission.assessment?.category || "N/A"}
        </p>
        <p className=" text-sm ">
          <strong>Score </strong> {submission.score}
        </p>

        <p className=" text-sm">
          <strong>User name </strong> {submission.user?.name || "Unknown"}
        </p>
        <p className=" text-sm">
          <strong>Child name </strong> {submission.patient?.name || "Unknown"}
        </p>
      </div>

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

      <div className="mt-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to List
        </button>
      </div>
    </section>
  );
};

export default InitialsDetails;
