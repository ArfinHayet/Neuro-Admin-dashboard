import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getAnswersByPatientAndAssessment } from "../../api/answers";

const OnDemandDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const passedSubmissions = state?.submissions || []; // note: array of submissions
  const [selectedSubmission, setSelectedSubmission] = useState(
    passedSubmissions[0] || null
  );
  const [groupedAnswers, setGroupedAnswers] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allAnswers, setAllAnswers] = useState({});



  useEffect(() => {
    const fetchAllAnswers = async () => {
      if (!passedSubmissions.length) return;

      const answersMap = {};

      await Promise.all(
        passedSubmissions.map(async (sub) => {
          try {
            const res = await getAnswersByPatientAndAssessment(
              sub.patient.id,
              sub.assessmentId,
              { limit: 100 }
            );
            const ans = res?.payload || [];

            const grouped = ans.reduce((acc, item) => {
              const type = sub.questionType || "Unknown";
              if (!acc[type]) acc[type] = [];
              acc[type].push(item);
              return acc;
            }, {});

            answersMap[sub.id] = grouped;
          } catch (err) {
            console.error("Error fetching answers for submission", sub.id, err);
            answersMap[sub.id] = {};
          }
        })
      );

      setAllAnswers(answersMap);
      setGroupedAnswers(answersMap[selectedSubmission.id] || {});
      setSelectedType(
        Object.keys(answersMap[selectedSubmission.id] || {})[0] || null
      );
      setIsLoading(false);
    };

    fetchAllAnswers();
  }, []);

  if (isLoading)
    return (
      <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
        <div className="flex justify-center items-center h-40">
          <p>Loading assessment details...</p>
        </div>
      </section>
    );

  if (!selectedSubmission) return <p>Submission not found.</p>;

  const questionTypes = Object.keys(groupedAnswers);

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold ">
        {selectedSubmission.assessment?.category || "Assessment"} Submission
        Details
      </h1>

      {/* Basic info */}
      <div className="text-sm space-y-1 pb-2">
        <p>
          <span className="font-semibold">User Name </span>
          {selectedSubmission.user?.name}
        </p>
        <p>
          <span className="font-semibold">Patient Name </span>
          {selectedSubmission.patient?.name}
        </p>
        <p>
          <span className="font-semibold">Clinician </span>
          {selectedSubmission.clinicianId ? "Assigned" : "Not assigned"}
        </p>
        <p>
          <span className="font-semibold">Status </span>
          {selectedSubmission.status}
        </p>
        {/* <p>
          <span className="font-semibold">Ratings: </span>
          {selectedSubmission.ratings}
        </p> */}
      </div>

      {/* Switch between multiple submissions if parent passes grouped */}
      {passedSubmissions.length > 1 && (
        <div className="mt-6 flex gap-2 flex-wrap">
          {passedSubmissions.map((sub, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedSubmission(sub);
                setGroupedAnswers(allAnswers[sub.id] || {});
                setSelectedType(
                  Object.keys(allAnswers[sub.id] || {})[0] || null
                );
              }}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                selectedSubmission.id === sub.id
                  ? "bg-[#114654] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {sub.questionType ||
                sub.assessment?.name ||
                `Submission ${i + 1}`}
            </button>

          
          ))}
        </div>
      )}
      {/* QuestionType buttons */}
      {/* <div className="flex gap-2 mt-6 flex-wrap">
        {questionTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              selectedType === type
                ? "bg-[#114654] text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div> */}

      {/* Questions & answers for selected type */}
      {/* <div className="mt-4 space-y-4 text-xs">
        {selectedType && groupedAnswers[selectedType]?.length > 0 ? (
          groupedAnswers[selectedType].map((ans, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {ans.question?.questions || "No question text"}
                </p>
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mt-1"></div>
                  <p className="text-secondary mt-1">
                    {ans.answer || "No answer"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl">
            No answers submitted yet for this question type.
          </p>
        )}
      </div> */}

      {/* Summary */}
      <div className="py-4 bg-white rounded-md mt-6 max-w-4xl">
        <h2 className=" font-semibold mb-2">AI Summary</h2>
        <p className="mt-1 text-gray-700 whitespace-pre-line text-xs">
          {selectedSubmission.summary
            ? selectedSubmission.summary.replace(/\*/g, "")
            : "No summary available."}
        </p>
      </div>
    </section>
  );
};

export default OnDemandDetails;
