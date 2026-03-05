// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getAllSubmissions } from "../../api/submissions";
// import { getAnswersByAssessmentId } from "../../api/answers";

// const InitialsDetails = () => {
//   const { submissionId } = useParams();
//   const navigate = useNavigate();

//   const [submission, setSubmission] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);

//         // 1️⃣ Fetch all submissions
//         const submissionsRes = await getAllSubmissions();
//         const submissions = submissionsRes.payload || [];
//         const thisSubmission = submissions.find(
//           (s) => String(s.id) === String(submissionId)
//         );

//         if (!thisSubmission) {
//           setSubmission(null);
//           setAnswers([]);
//           return;
//         }

//         setSubmission(thisSubmission);

//         // 2️⃣ Fetch answers by patientId and assessmentId
//         const patientId = thisSubmission.patient?.id;
//         const assessmentId = thisSubmission.assessmentId;

//         if (!patientId || !assessmentId) {
//           setAnswers([]);
//         } else {
//           const answersRes = await getAnswersByAssessmentId(
//             patientId,
//             assessmentId,
//             {
//               limit: 100, // optional, depends on API
//             }
//           );
//           const fetchedAnswers = answersRes?.payload || [];
//           setAnswers(fetchedAnswers);
//         }
//       } catch (err) {
//         console.error("Failed to fetch assessment details:", err);
//         setSubmission(null);
//         setAnswers([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [submissionId]);

//  if (isLoading) {
//    return (
//      <section className="h-[90vh] flex flex-col justify-center items-center">
//        <div className="custom-loader"></div>
//        <p className="mt-4 text-sm text-gray-500">
//          Loading Assessment Submissions Details...
//        </p>
//      </section>
//    );
//  }

//   if (!submission) {
//     return (
//       <div className="p-6 mx-auto">
//         <h2 className="text-xl font-semibold mb-4">Assessment not found.</h2>
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//         >
//           Back to List
//         </button>
//       </div>
//     );
//   }

//   return (
//     <section className="space-y-4 pb-14">
//       <h1 className="text-xl font-semibold mb-2">
//         {submission.assessment?.name || "Assessment"} Details
//       </h1>

//       {/* Basic info */}
//       <div className="text-sm space-y-0.5 pb-0">
//         <p>
//           <strong>Date Taken </strong>{" "}
//           {new Date(submission.createdAt).toLocaleDateString()}
//         </p>

//         <p>
//           <strong>Score </strong> {submission.score ?? "N/A"}
//         </p>
//         <p>
//           <strong>User Name </strong> {submission.user?.name || "Unknown"}
//         </p>
//         <p>
//           <strong>Patient Name </strong> {submission.patient?.name || "Unknown"}
//         </p>
//       </div>

//       {/* Questions & answers */}
//       <div className="space-y-4">
//         {answers.length > 0 ? (
//           answers.map((ans, i) => (
//             <div
//               key={i}
//               className="flex flex-col gap-2 border-b border-gray-200 p-2  bg-white max-w-4xl"
//             >
//               <p className="font-medium text-gray-800 text-sm">
//                 Q{i + 1}. {ans.question?.questions || "No question text"}
//               </p>
//               <p className="text-gray-500 text-xs">
//                 <strong>Answer </strong> {ans.answer || "No answer"}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl">
//             No answers submitted yet for this assessment.
//           </p>
//         )}
//       </div>

//     </section>
//   );
// };

// export default InitialsDetails;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllanswers } from "../../api/answers";

const groupAnswersByType = (answersRaw = []) => {
  const grouped = {};

  answersRaw.forEach((item) => {
    const typeName = (
      item.question?.questionType?.name ||
      item.question?.questionType ||
      item.questionType ||
      "Unknown"
    ).trim();

    if (!grouped[typeName]) {
      grouped[typeName] = {
        name: typeName,
        answers: [],
      };
    }

    grouped[typeName].answers.push({
      question:
        item.question?.questions ||
        item.question?.questionText ||
        "No question",
      answer: item.answer || "No answer",
      variant: item.question?.variant,
      extraInfo: item.extraInfo,
    });
  });

  return grouped;
};

const InitialsDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const passedSubmissions = state?.submissions || [];
  const [selectedSubmission] = useState(passedSubmissions[0] || null);

  const [groupedAnswers, setGroupedAnswers] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSubmission) return;

      try {
        setIsLoading(true);
        console.log(selectedSubmission);

        const patientId =
          selectedSubmission.patient?.id || selectedSubmission.patientId;
        const assessmentId = selectedSubmission.assessmentId;

        if (!patientId || !assessmentId) {
          setGroupedAnswers({});
          return;
        }

        const answersRes = await getAllanswers({ patientId, assessmentId });
        const fetchedAnswers = answersRes?.payload || [];
        const grouped = groupAnswersByType(fetchedAnswers);
        setGroupedAnswers(grouped);
        setSelectedType(Object.keys(grouped)[0] || null);
      } catch (err) {
        console.error("Failed to fetch assessment details:", err);
        setGroupedAnswers({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedSubmission]);

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

  if (!selectedSubmission) {
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
        {selectedSubmission.assessment?.name || "Assessment"} Details
      </h1>

      {/* Basic Info */}
      <div className="text-sm space-y-0.5 pb-0">
        <p>
          <strong>Date Taken </strong>
          {new Date(selectedSubmission.createdAt).toLocaleDateString("en-GB")}
        </p>
        <p>
          <strong>Score </strong> {selectedSubmission.score ?? "N/A"}
        </p>
        <p>
          <strong>User Name </strong>{" "}
          {selectedSubmission.user?.name || "Unknown"}
        </p>
        <p>
          <strong>Patient Name </strong>{" "}
          {selectedSubmission.patient?.name || "Unknown"}
        </p>
      </div>

      {/* Question Type Tabs */}
      <div className="flex gap-2 flex-wrap mt-2">
        {Object.entries(groupedAnswers).map(([typeId, data]) => {
          const isExternalType = data.answers.some(
            (a) => a.variant === "external",
          );
          return (
            <button
              key={typeId}
              onClick={() => setSelectedType(typeId)}
              className={`px-4 py-2 rounded-full text-xs font-medium ${
                selectedType === typeId
                  ? "bg-[#114654] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {data.name}
              {isExternalType && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold ml-2">
                  External
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reviewer Block */}
      {groupedAnswers[selectedType]?.answers?.some(
        (a) => a.variant === "external",
      ) && (
        <div className="p-3 border rounded-md bg-amber-50 text-xs space-y-1 mb-3">
          <p>
            <span className="font-semibold">Reviewer Name </span>
            {selectedSubmission.reviewer_name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Occupation </span>
            {selectedSubmission.reviewer_occupation || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Relation </span>
            {selectedSubmission.reviewer_relation || "N/A"}
          </p>
        </div>
      )}

      {/* Questions & Answers */}
      <div className="space-y-4">
        {selectedType && groupedAnswers[selectedType]?.answers?.length > 0 ? (
          groupedAnswers[selectedType].answers.map((ans, i) => {
            const isExternal = ans.variant === "external";

            if (isExternal) {
              return (
                <div
                  key={i}
                  className="p-3 border rounded-md bg-blue-50 space-y-1 text-sm"
                >
                  <p className="font-medium text-gray-800">Q: {ans.question}</p>
                  <p>
                    <span className="font-semibold">Answer: </span>
                    {ans.answer}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={i}
                className="flex justify-between items-start border-b p-2 bg-white text-sm"
              >
                <p className="font-medium text-gray-800">{ans.question}</p>
                <p className="text-gray-500 text-xs mt-1">{ans.answer}</p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 border border-gray-300 rounded-xl p-4 bg-white">
            No answers submitted yet for this question type.
          </p>
        )}
      </div>
    </section>
  );
};

export default InitialsDetails;