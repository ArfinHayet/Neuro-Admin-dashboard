/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import {
  deleteQuestion,
  getQuestionsByAssessmentId,
} from "../../../api/questionnaires";
import OnDemandQuestionModal from "../../../Components/Assessments/OnDemandQuestionModal";
import QuestionArrangement from "../../../Components/Common/QuestionArrangement";

const CategoryBasedQuestionList = () => {
  const { id: paramId, categoryId } = useParams();
  const location = useLocation();
    const categoryName = location.state?.categoryName;
    const assessmentName = location.state?.assessment?.name;
const assessmentID = location.state?.assessmentId || paramId;

  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fetchQuestions = async () => {
  //   try {
  //     setIsLoading(true);
  //     const res = await getQuestionsByAssessmentId(assessmentID);
  //     const data = res?.payload || [];
  //     // later we can filter by categoryId once backend supports it
  //     setQuestions(data);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to fetch questions");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

 const fetchQuestions = async () => {
   try {
     setIsLoading(true);
     const res = await getQuestionsByAssessmentId(assessmentID);
     const allQuestions = res?.payload || [];

     // ✅ Filter only the questions that belong to this category
     const filtered = allQuestions.filter(
       (q) => q.question_category?.id?.toString() === categoryId?.toString()
     );

     console.log(filtered);

     setQuestions(filtered);
   } catch (err) {
     console.error(err);
     setError("Failed to fetch questions");
   } finally {
     setIsLoading(false);
   }
 };


  useEffect(() => {
    fetchQuestions();
  }, [assessmentID]);



  // const handleSave = async (newQ) => {
  //   try {
  //     setIsLoading(true);
  //     // Re-fetch from backend to ensure you have fresh data
  //     await fetchQuestions();
  //     toast.success(editingQuestion ? "Question updated" : "Question added", {
  //       position: "top-right",
  //     });
  //   } catch (err) {
  //     console.error("Error refetching after save:", err);
  //   } finally {
  //     setIsLoading(false);
  //     setEditingQuestion(null);
  //     setIsModalOpen(false);
  //   }
  // };

// const handleSave = (savedQuestion) => {
//   // If editing, update existing question
//   if (editingQuestion) {
//     setQuestions((prev) =>
//       prev.map((q) => (q.id === savedQuestion.id ? savedQuestion : q))
//     );
//     toast.success("Question updated", { position: "top-right" });
//   } else {
//     // If adding, append new question to state
//     setQuestions((prev) => [...prev, savedQuestion]);
//     toast.success("Question added", { position: "top-right" });
//   }

//   setEditingQuestion(null);
//   setIsModalOpen(false);
  // };
  
  const handleSave = async (savedQuestion) => {
    try {
      setIsLoading(true);

      // Refetch all questions from backend to stay in sync
      await fetchQuestions();

      toast.success(editingQuestion ? "Question updated" : "Question added", {
        position: "top-right",
      });
    } catch (err) {
      console.error("Error refetching after save:", err);
      toast.error("Failed to fetch questions", { position: "top-right" });
    } finally {
      setIsLoading(false);
      setEditingQuestion(null);
      setIsModalOpen(false);
    }
  };



  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Question deleted successfully", {
        position: "top-right",
      });
    } catch (err) {
      toast.error("Failed to delete question", { position: "top-right" });
      console.error(err);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  // if (isLoading) {
  //   return (
  //     <section className="h-[90vh] flex justify-center items-center rounded-2xl px-4 pt-5">
  //       <p>Loading questions...</p>
  //     </section>
  //   );
  // }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="font-semibold ">{assessmentName}</h2>
          <h2 className="text-sm  mb-1">Question Category:<span className="font-semibold"> {categoryName}</span>  </h2>
          <p className="text-sm text-gray-500">
            Total Questions: {questions.length}
          </p>
        </div>
        <button
          className="bg-[#114654] text-white px-4 py-2 rounded-full text-sm"
          onClick={() => {
            setEditingQuestion(null);
            setIsModalOpen(true);
          }}
        >
          Add Question
        </button>
      </div>

      <div className="h-[75vh] overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-[#f3f1f1] font-light">
            <tr>
              <th className="pl-4">Sl</th>
              <th className="p-2">Question</th>
              <th className="p-2">Order</th>
              <th className="p-2">Answer Type</th>
              <th className="p-2">Variant</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <QuestionArrangement
                key={q.id}
                index={i}
                question={q}
                onChange={(id, field, value) =>
                  setQuestions((prev) =>
                    prev.map((ques) =>
                      ques.id === id ? { ...ques, [field]: value } : ques
                    )
                  )
                }
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>


      <OnDemandQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        defaultType="ondemand"
        editingQuestion={editingQuestion}
        assessment={{ id: assessmentID, name: assessmentName }}
        categoryId={categoryId}
        categoryName={categoryName} 
      />
    </section>
  );
};

export default CategoryBasedQuestionList;
