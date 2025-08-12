import { useState } from "react";
import { useParams } from "react-router-dom";
import { onDemandAssessments } from "../../../Components/utils/Data";
import QuestionArrangement from "../../../Components/Common/QuestionArrangement";
 import { initialQuestions } from "../../../Components/utils/Data";
import QuestionModal from "../../../Components/Common/QuestionModal";


const AssessmentDetails = () => {
   const [questions, setQuestions] = useState(
     initialQuestions.map((q, idx) => ({
       ...q,
       order: idx + 1,
       answerType: "yesno", // default
     }))
   );
   const [isModalOpen, setIsModalOpen] = useState(false);

   const [editingQuestion, setEditingQuestion] = useState(null);

  const handleSave = (newQ) => {
    if (editingQuestion) {
      // Update existing
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion.id ? { ...q, ...newQ } : q))
      );
      setEditingQuestion(null);
    } else {
      // Add new
      setQuestions((prev) => [
        ...prev,
        {
          id: Date.now(),
          order: prev.length + 1,
          ...newQ,
        },
      ]);
    }
  };

  const handleDelete = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
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
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-medium ">{assessment.title}</h2>
        <button
          className="bg-[#114654] text-white px-4 py-2 rounded-full text-sm"
          onClick={() => setIsModalOpen(true)}
        >
          Add Question
        </button>
      </div>
      <p className="mb-2 text-gray-700 text-sm">
        <strong></strong> {assessment.description}
      </p>
      <p className="mb-4 text-gray-700 text-sm">
        <strong></strong> {assessment.time}
      </p>

      <h3 className="font-medium my-3">Question List</h3>
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
           {questions.map((q, i) => (
            <QuestionArrangement
              key={q.id}
              index={i}
              question={q}
              onChange={(id, field, value) => {
                setQuestions((prev) =>
                  prev.map((ques) =>
                    ques.id === id ? { ...ques, [field]: value } : ques
                  )
                );
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
         <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        defaultType="ondemand"
      />
    </section>
  );
};

export default AssessmentDetails;
