import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { assessments, initialQuestions } from "../../Components/utils/Data";
import { getAllSubmissions } from "../../api/submissions";
import { getAnswersByAssessmentId } from "../../api/answers";

const InitialsDetails = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssessmentDetails();
  }, [assessmentId]);

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

        if (isLoading) {
    return (
      <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-5">
        <div className="flex justify-center items-center h-40">
          <p>Loading assessment details...</p>
        </div>
      </section>
    );
  }

  if (!assessment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
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
          {new Date(assessment.createdAt).toLocaleDateString()}
        </p>
        <p className=" text-sm">
          <strong>Category </strong> {assessment.assessment?.category || "N/A"}
        </p>
        <p className=" text-sm ">
          <strong>Score </strong> {assessment.score}
        </p>

        <p className=" text-sm">
          <strong>User name  </strong> {assessment.user?.name || "Unknown"}
        </p>
        <p className=" text-sm">
          <strong>Child name  </strong> {assessment.patient?.name || "Unknown"}
        </p>
      </div>

      <table className="w-full border border-gray-300 text-left bg-white text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border  text-xs border-gray-300">Question</th>
            <th className="p-2 border text-xs border-gray-300">Answer</th>
          </tr>
        </thead>
        <tbody>
          {answers.length > 0 ? (
            answers.map((ans) => (
              <tr key={ans.id} className="border border-gray-300 text-xs">
                <td className="p-2 border border-gray-300">
                  {ans.question?.questions}
                </td>
                <td className="p-2 border border-gray-300">{ans.answer}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-2 border text-center text-gray-500">
                No answer found.{" "}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default InitialsDetails;
