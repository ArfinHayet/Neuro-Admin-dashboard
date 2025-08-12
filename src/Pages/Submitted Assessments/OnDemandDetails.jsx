import React, { useState } from "react";
import { useParams,  } from "react-router-dom";
import { assessments, onDemandAssessments } from "../../Components/utils/Data";

const OnDemandDetails = () => {
  const { assessmentId } = useParams();
  const [activeTab, setActiveTab] = useState("questions");

  const assessment = assessments.find(a => a.id === parseInt(assessmentId));
  if (!assessment) return <p>Assessment not found.</p>;

  const assessmentTemplate = onDemandAssessments.find(o => o.title === assessment.name);

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <h1 className="text-2xl font-semibold mb-4">{assessment.name} Details</h1>

      <div className="mb-4">
        <button
          className={`mr-4 px-4 py-2 rounded-full ${activeTab === "questions" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("questions")}
        >
          Questions
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeTab === "summary" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("summary")}
        >
          AI Summary
        </button>
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
            {assessment.answers.map((ans, i) => {
              // Find the question text by id if answers have questionId
              const questionText = ans.question || 
                (assessmentTemplate?.questions.find(q => q.id === ans.questionId)?.question || "Question not found");

              return (
                <tr key={i} className="border border-gray-300">
                  <td className="p-2 border border-gray-300">{questionText}</td>
                  <td className="p-2 border border-gray-300">{ans.answer}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {activeTab === "summary" && (
        <div className="p-4 bg-white  ">
          <p>This is a generated AI summary of the assessment results. (You can replace this with your AI integration output.)</p>
        </div>
      )}


    </section>
  );
};

export default OnDemandDetails;
