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
import CSVQuestionAddModal from "../../../Components/Assessments/CSVQuestionAddModal";

const CategoryBasedQuestionList = () => {
  const { id: paramId, categoryId } = useParams();
  const location = useLocation();
  const categoryName = location.state?.categoryName;
  
  const categoryVariant = location.state?.categoryVariant;
  console.log(categoryVariant)
  const assessmentName = location.state?.assessment?.name;
  const assessmentID = location.state?.assessmentId || paramId;
  const assessmentDes = location.state?.assessment?.description;

  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await getQuestionsByAssessmentId(assessmentID);
      const allQuestions = res?.payload || [];

      const filtered = allQuestions.filter(
        (q) => q.question_category?.id?.toString() === categoryId?.toString()
      );

      console.log("question", filtered);

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

  const handleSave = async (savedQuestion) => {
    try {
      setIsLoading(true);

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

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedIds.includes(id);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one question");
      return;
    }

    try {
      await Promise.all(selectedIds.map((id) => deleteQuestion(id)));

      toast.success("Questions deleted successfully", {
        position: "top-right",
      });

      setSelectedIds([]);
      await fetchQuestions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete selected questions");
    }
  };

  return (
    <section className="">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2">
          <h2 className="font-semibold ">{assessmentName}</h2>
          <h2 className="text-sm  ">
            Question Category -
            <span className="font-semibold"> {categoryName}</span> - ({categoryVariant}){" "}
          </h2>
    
          <p className="text-sm text-gray-500 ">Questions count {questions.length}
          </p>
        </div>

        <div className="flex  gap-2 pt-2">
          {selectedIds.length > 0 && (
            <button
              className="bg-red-600 text-white px-3 py-2 rounded-full text-xs "
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}

          <button
            className="bg-[#114654] hover:bg-[#114654]/80 text-white px-3 py-2 rounded-md text-xs"
            onClick={() => setIsCsvModalOpen(true)}
          >
            Import from CSV
          </button>

          <button
            className="bg-[#114654] hover:bg-[#114654]/80 text-white px-3 py-2 rounded-md text-xs"
            onClick={() => {
              setEditingQuestion(null);
              setIsModalOpen(true);
            }}
          >
            Add Question
          </button>
        </div>
      </div>

      <div className="h-[75vh] overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-[#f3f1f1] font-light">
            <tr>
              <th className="pl-2">
                <input
                  type="checkbox"
                  checked={
                    questions.length > 0 &&
                    selectedIds.length === questions.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(questions.map((q) => q.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </th>
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
                selected={isSelected(q.id)}
                isSelected={selectedIds.includes(q.id)}
                onSelect={(id, checked) =>
                  setSelectedIds((prev) =>
                    checked ? [...prev, id] : prev.filter((x) => x !== id)
                  )
                }
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

      <CSVQuestionAddModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        assessmentId={assessmentID}
        categoryId={categoryId}
        onSuccess={fetchQuestions}
      />
    </section>
  );
};

export default CategoryBasedQuestionList;
