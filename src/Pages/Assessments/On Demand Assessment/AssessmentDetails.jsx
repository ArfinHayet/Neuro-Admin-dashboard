import { useState } from "react";
import { useParams } from "react-router-dom";
import { onDemandAssessments } from "../../../Components/utils/Data";
import QuestionArrangement from "../../../Components/Assessments/QuestionArrangement";
 import { initialQuestions } from "../../../Components/utils/Data";

const AssessmentDetails = () => {
  const [questions, setQuestions] = useState(
     initialQuestions.map((q, idx) => ({
       ...q,
       order: idx + 1,
       answerType: "yesno", // default
     }))
   );
 
   const handleQuestionChange = (id, field, value) => {
     const updated = questions.map((q) =>
       q.id === id ? { ...q, [field]: value } : q
     );
     setQuestions(updated);
   }; 
   
   const { id } = useParams();
  const assessment = onDemandAssessments.find(
    (item) => item.id.toString() === id
  );

  if (!assessment) {
    return <div className="p-6 text-red-600">Assessment not found</div>;
  }

  
  return (
    <section className="p-6 bg-[#F6F7F9] rounded-xl h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">{assessment.title}</h2>
      <p className="mb-2 text-gray-700 text-sm">
        <strong></strong> {assessment.description}
      </p>
      <p className="mb-4 text-gray-700 text-sm">
        <strong></strong> {assessment.time} minutes
      </p>

      <h3 className="text-xl font-medium mb-2">Questions</h3>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-white">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Question</th>
            <th className="p-2">Order</th>
            <th className="p-2">Answer Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions
            .sort((a, b) => a.order - b.order)
            .map((q, i) => (
              <QuestionArrangement
                key={q.id}
                index={i}
                question={q}
                onChange={handleQuestionChange}
              />
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default AssessmentDetails;
