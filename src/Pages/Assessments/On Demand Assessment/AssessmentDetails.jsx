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
import {
  getAllQuestionCategories,
  deleteQuestionCategory,
  updateQuestionCategory,
} from "../../../api/questioncategories";

import { useLocation } from "react-router-dom";
import { MdEdit, MdDeleteOutline } from "react-icons/md";

import QuestionCategoryAddModal from "../../../Components/Assessments/QuestionCategoryAddModal";
import toast from "react-hot-toast";
import { PiTrashFill } from "react-icons/pi";
import { MdOutlineArrowOutward } from "react-icons/md";

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
  const [isInitialLoad, setIsInitialLoad] = useState(true); 

  const fetchData = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      const assessmentsResponse = await getAssessments();
      const allAssessments = assessmentsResponse?.payload || [];
      const thisAssessment = allAssessments.find((a) => a.id.toString() === id);

      if (!thisAssessment) {
        setError("Assessment not found");
              if (!silent) setIsLoading(false);
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

      // filter categories based on current assessment id
       const filteredCategories = categoryData
         .filter((cat) => cat.assessmentId?.toString() === id)
         .sort((a, b) => a.order - b.order);

      setCategories(filteredCategories);
      console.log(filteredCategories);
    } catch (err) {
      console.error("Failed to fetch assessment details", err);
      setError("Failed to load assessment details");
    } finally {
     if (!silent) setIsLoading(false);
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

  if (isLoading && isInitialLoad) {
    return (
      <section className="h-[90vh] flex flex-col justify-center items-center">
        <div className="custom-loader"></div>
        <p className="mt-4 text-sm text-gray-500">
          Loading assessments details...
        </p>
      </section>
    );
  }

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
          className="bg-[#114654] text-white px-4 py-2 rounded-full text-xs"
          onClick={() => {
            setEditingCategory(null);
            setIsCategoryModalOpen(true);
          }}
        >
          Add Question Category
        </button>
      </div>
      <p className="text-xs text-secondary mb-2 w-[65vw]">
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
      <hr />


      {/* Category Grid */}
      <h3 className="font-medium my-3">Question Category List</h3>
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4  ">
        {categories.length > 0 ? (
          // categories.map((cat) => (
             [...categories]
      .sort((a, b) => a.order - b.order) // Sort by order ascending
      .map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between relative  rounded-xl hover:shadow-md p-3 h-[130px] bg-[#eef8f9]"
            >
              <div className="">
            <h4 className="font-semibold text-sm ">#{cat.id} {cat.name}</h4>
                <p className="text-xs mb-1 text-gray-700">{cat.variant}</p>
                <p className="text-xs mb-1 text-gray-700">order {cat.order}</p>
              </div>
              <div className="flex  justify-between  item-center">
                <button
                  onClick={() =>
                    navigate(`/ondemandassessment/${id}/category/${cat.id}`, {
                      state: {
                        assessmentId: id,
                        categoryId: cat.id,
                        categoryName: cat.name,
                        categoryVariant: cat.variant,
                        assessment: assessment,
                      },
                    })
                  }
                  className="text-xs bg-[#114654]/80 hover:bg-[#114654] text-white px-2.5 py-1 rounded-full "
                >
                  View Category
                </button>
                <div className="flex gap-0.5">
                  <div className="bg-white h-8 w-8 rounded-full flex justify-center items-center border">
                    <MdEdit
                      className="text-teal-800 cursor-pointer size-4"
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsCategoryModalOpen(true);
                      }}
                    />{" "}
                  </div>
                  <div className="bg-white h-8 w-8 rounded-full flex justify-center items-center border">
                    <PiTrashFill
                      className="text-red-600 cursor-pointer size-4"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowDeleteModal(true);
                      }}
                    />
                  </div>
                </div>
                {/* <div className="bg-gray-100 hover:bg-[#114654]/25 h-8 w-8 rounded-full flex justify-center items-center">
                  <MdOutlineArrowOutward
                    className=" cursor-pointer size-5 "
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowDeleteModal(true);
                    }}
                  />
                </div> */}
              </div>

              {/* <p className="text-xs text-gray-500 mb-2">
                Questions: <span className="font-medium">0</span>
              </p> */}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No categories found.</p>
        )}
      </div>

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
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={() => fetchData(true)}
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
