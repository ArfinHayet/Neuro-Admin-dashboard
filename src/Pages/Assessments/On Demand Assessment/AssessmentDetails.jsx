/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionArrangement from "../../../Components/Common/QuestionArrangement";
import OnDemandQuestionModal from "../../../Components/Assessments/OnDemandQuestionModal";
import {
  deleteQuestion,
  getQuestionsByAssessmentId,
} from "../../../api/questionnaires";
import { getAssessments } from "../../../api/assessments";
import { getAllQuestionCategories, deleteQuestionCategory } from "../../../api/questioncategories";

import { useLocation } from "react-router-dom";
import { MdEdit, MdDeleteOutline } from "react-icons/md";

import QuestionCategoryAddModal from "../../../Components/Assessments/QuestionCategoryAddModal";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";


const AssessmentDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const priceMap = location.state?.priceMap || {};

  const [categories, setCategories] = useState([]);

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const assessmentsResponse = await getAssessments();
      const allAssessments = assessmentsResponse?.payload || [];
      const thisAssessment = allAssessments.find((a) => a.id.toString() === id);

      if (!thisAssessment) {
        setError("Assessment not found");
        setIsLoading(false);
        return;
      }

      setAssessment(thisAssessment);
      console.log(id);
      const questionsResponse = await getQuestionsByAssessmentId(
        thisAssessment.id
      );
      console.log("reponse", questionsResponse);
      const questionsData = questionsResponse?.payload || [];
      setQuestions(questionsData);
      // } catch (err) {
      //   console.error("Failed to fetch assessment details", err);
      //   setError("Failed to load assessment details");
      // } finally {
      //   setIsLoading(false);
      // }

      const categoryResponse = await getAllQuestionCategories();
      const categoryData = categoryResponse?.payload || [];
      setCategories(categoryData);
    } catch (err) {
      console.error("Failed to fetch assessment details", err);
      setError("Failed to load assessment details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSave = (newQ) => {
    if (editingQuestion) {
      setQuestions((prev) =>
        (prev ?? []).map((q) =>
          q.id === editingQuestion.id ? { ...q, ...newQ } : q
        )
      );
      setEditingQuestion(null);
    } else {
      setQuestions((prev) => [...(prev ?? []), newQ]);
    }
    setIsModalOpen(false);
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

  const handleDeleteCategory = async (category) => {
    try {
      await deleteQuestionCategory(category.id);
      toast.success(`"${category.name}" deleted successfully`, {
        position: "top-right",
        duration: 3000,
      });
      fetchData(); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category", {
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  if (error) {
    return <p> {error} </p>;
  }

  // if (isLoading) {
  //   return (
  //     <section className="h-[90vh] flex justify-center items-center rounded-2xl px-4 pt-5">
  //       <p>Loading assessments...</p>
  //     </section>
  //   );
  // }

  return (
    <section className="">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">{assessment?.name}</h2>
        {/* <button
          className="bg-[#114654] text-white px-4 py-2 rounded-full text-sm"
          onClick={() => {
            setEditingQuestion(null);
            setIsModalOpen(true);
          }}
        >
          Add Question
        </button> */}
        <button
          className="bg-[#114654] text-white px-4 py-2 rounded-full text-sm"
          onClick={() => {
            setEditingCategory(null);
            setIsCategoryModalOpen(true);
          }}
        >
          Add Question Category
        </button>
      </div>
      <p className="text-xs text-secondary mb-2">
        {/* View, Edit and manage questions for the On-Demand Assessment to ensure accuracy and relevance. */}
        {assessment?.description}
      </p>
      <p className="mb-1 text-gray-700 text-sm">
        <strong>Category </strong>
        {assessment?.category || "N/A"}
      </p>
      <p className="mb-1 text-gray-700 text-sm">
        <strong>Duration </strong>
        {assessment?.totalTime || "N/A"}
      </p>
      <p className="mb-4 text-gray-700 text-sm">
        <strong>Price </strong>£{priceMap[assessment?.priceId] ?? "N/A"}
      </p>

      {/* Category Grid */}
      <h3 className="font-medium my-3">Question Category List</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white relative border rounded-xl shadow-sm p-4 "
            >
              <h4 className="font-semibold text-sm mb-1">{cat.name}</h4>
              <div className="absolute top-5 right-2 flex gap-1 text-lg">
                <MdEdit
                  className="text-blue-800 cursor-pointer"
                  onClick={() => {
                    setEditingCategory(cat);
                    setIsCategoryModalOpen(true);
                  }}
                />
                <MdDeleteOutline
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowDeleteModal(true);
                  }}
                />
              </div>

              {/* <p className="text-xs text-gray-500 mb-2">
                Questions: <span className="font-medium">0</span>
              </p> */}
              <button
                onClick={() =>
                  navigate(
                    `/ondemandassessment/${id}/category/${cat.id}`,
                    {
                      state: {
                        assessmentId: id,
                        categoryId: cat.id,
                        categoryName: cat.name,
                        assessment: assessment,
                      },
                    }
                  )
                }
                className="text-xs bg-[#114654] text-white px-3 py-1.5 rounded-full"
              >
                View Category
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No categories found.</p>
        )}
      </div>

      {/* <h3 className="font-medium my-3">Question List</h3>
      <div className="h-[60vh] overflow-y-auto">
        <table className="w-full max-h-[50vh]  text-sm text-left text-gray-700 ">
          <thead className="bg-[#f3f1f1] font-light">
            <tr>
              <th className="pl-4">Sl</th>
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
      </div> */}
      <OnDemandQuestionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSave={handleSave}
        defaultType="ondemand"
        editingQuestion={editingQuestion}
        assessment={assessment}
      />

      <QuestionCategoryAddModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={fetchData}
        editingCategory={editingCategory}
      />

      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 flex items-start justify-center pt-10 bg-black bg-opacity-15 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-sm mb-4">
              Are you sure you want to delete “{selectedCategory.name}”?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDeleteCategory(selectedCategory)}
                className="bg-[#114654] text-white px-4 py-1 rounded hover:bg-opacity-80 text-sm"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AssessmentDetails;
