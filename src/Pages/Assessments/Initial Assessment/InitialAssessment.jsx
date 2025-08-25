/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
//import { initialQuestions } from "../../../Components/utils/Data";
import QuestionArrangement from "../../../Components/Common/QuestionArrangement";
import InitialModal from "../../../Components/Assessments/InitialModal";
import {
  getQuestionsByAssessmentId,
  deleteQuestion,
  getAllQuestions,
} from "../../../api/questionnaires";
import { getAssessments } from "../../../api/assessments";

const InitialAssessment = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [initialAssessment, setInitialAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInitialAssessment();
  }, []);

  const fetchInitialAssessment = async () => {
    try {
      setIsLoading(true);
      const data = await getAssessments();
      const initial = data?.payload?.find((a) => a.type === "free");
      console.log("ee", data);
      setInitialAssessment(initial || null);

      if (initial) {
        fetchQuestions(initial.id);
      }
    } catch (err) {
      console.error("Failed to fetch assessments", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async (assessmentId) => {
    try {
      const data = await getQuestionsByAssessmentId(assessmentId);
      console.log("lll", data?.payload);
      if (data) {
        const questionsArray = data.payload.map((q, i) => ({
          id: q.id || i + 1,
          question: q.questions || q.question || "",
          order: q.order || i + 1,
          answerType: q.answerType === "MultipleChoice" 
          ? "multiple" 
          : q.answerType === "YesNo" 
          ? "yesno" 
          : "text",
        answers: q.options ? q.options.map(option => ({ 
          label: option, 
          score: 0 ,
        })) : []
        }));

        setQuestions(questionsArray);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

 const handleSave = (savedQuestion) => {
  console.log("Saved question received:", savedQuestion);
  
  const newQ = {
    id: savedQuestion.id , 
    questions: savedQuestion.questions || savedQuestion.question,
    order: savedQuestion.order,
    answerType: savedQuestion.answerType,
    answers: savedQuestion.answers || savedQuestion.options || []
  };

  if (editingQuestion) {
    setQuestions(prev => prev.map(q => 
      q.id === editingQuestion.id ? newQ : q
    ));
  } else {
    setQuestions(prev => [...prev, newQ]);
  }
  
  setIsModalOpen(false);
  setEditingQuestion(null);
};

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Failed to delete question", err);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className="h-[90vh] flex justify-center items-center bg-white rounded-2xl px-4 pt-5">
        <p>Loading assessment details...</p>
      </section>
    );
  }

  return (
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-5">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-semibold ">Initial Assessment</h2>
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
      <p className="text-xs text-secondary">
        View, Edit and manage questions for the Initial Assessment to ensure
        accuracy and relevance.
      </p>

      <h3 className="font-medium my-3">Question List</h3>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-[#f3f1f1] font-light">
          <tr>
            <th className="pl-4">#</th>
            <th className="p-2">Question</th>
            <th className="p-2">Order</th>
            <th className="p-2">Answer Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions?.map((q, i) => (
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

      <InitialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        defaultType="initial"
        editingQuestion={editingQuestion}
        fetchQuestions={() =>
          initialAssessment && fetchQuestions(initialAssessment.id)
        }
      />
    </section>
  );
};

export default InitialAssessment;
