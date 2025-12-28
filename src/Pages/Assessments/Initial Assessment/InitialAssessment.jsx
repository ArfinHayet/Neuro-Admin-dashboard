/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import QuestionArrangement from "../../../Components/Common/QuestionArrangement";
import InitialModal from "../../../Components/Assessments/InitialModal";
import {
  getQuestionsByAssessmentId,
  deleteQuestion,
  getAllQuestions,
} from "../../../api/questionnaires";
import { getAssessments } from "../../../api/assessments";
import { getAllQuestionCategories, updateQuestionCategory, deleteQuestionCategory } from "../../../api/questioncategories";
import QuestionCategoryAddModal from "../../../Components/Assessments/QuestionCategoryAddModal";
import toast from "react-hot-toast";
import { MdEdit, MdOutlineArrowOutward } from "react-icons/md";
import { PiTrashFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import OnDemandQuestionModal from "../../../Components/Assessments/OnDemandQuestionModal";



const InitialAssessment = () => {
    const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [initialAssessment, setInitialAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);

   const priceMap = location.state?.priceMap || {};

   const [categories, setCategories] = useState([]);

   const [assessment, setAssessment] = useState(null);
   const [error, setError] = useState(null);

   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
   
   const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
    // const location = useLocation();



  useEffect(() => {
    fetchInitialAssessment();
  }, []);

 const fetchInitialAssessment = async () => {
   try {
     setIsLoading(true);
     const data = await getAssessments();

     const initial = data?.payload?.find((a) => a.type === "free");

     setInitialAssessment(initial || null);
     setAssessment(initial || null);

     if (initial) {
       fetchQuestions(initial.id);
       fetchCategories(initial.id);
     }
   } catch (err) {
     console.error(err);
   } finally {
     setIsLoading(false);
   }
 };

  const fetchCategories = async (assessmentId) => {
    const res = await getAllQuestionCategories();
    const all = res?.payload || [];

    const filtered = all.filter((cat) => cat.assessmentId === assessmentId);

    setCategories(filtered);
  };


  const fetchQuestions = async (assessmentId) => {
    try {
      const data = await getQuestionsByAssessmentId(assessmentId);
      // console.log("lll", data?.payload);
      if (data) {
        const questionsArray = data.payload.map((q, i) => ({
          id: q.id || i + 1,
          question: q.questions || q.question || "",
          order: q.order || i + 1,
          variant: q.variant,
          answerType:
            q.answerType === "MultipleChoice"
              ? "multiple"
              : q.answerType === "YesNo"
              ? "yesno"
              : "text",
          answers: q.options
            ? q.options.map((option) => ({
                label: option,
                score: 0,
              }))
            : [],
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
      id: savedQuestion.id,
      questions: savedQuestion.questions || savedQuestion.question,
      order: savedQuestion.order,
      answerType: savedQuestion.answerType,
      answers: savedQuestion.answers || savedQuestion.options || [],
    };

    if (editingQuestion) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion.id ? newQ : q))
      );
    } else {
      setQuestions((prev) => [...prev, newQ]);
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


  
  const fetchData = async () => {
  if (!assessment?.id) return;

  try {
    setIsLoading(true);
    await fetchQuestions(assessment.id);
    await fetchCategories(assessment.id);
  } finally {
    setIsLoading(false);
  }
};

  //   try {
  //     setIsLoading(true);
  //     // const assessmentsResponse = await getAssessments();
  //     // const allAssessments = assessmentsResponse?.payload || [];
  //     // const thisAssessment = allAssessments.find((a) => a.id.toString() === id);

  //     // if (!thisAssessment) {
  //     //   setError("Assessment not found");
  //     //   setIsLoading(false);
  //     //   return;
  //     // }

  //     // setAssessment(thisAssessment);
  //     console.log(id);
  //     const questionsResponse = await getQuestionsByAssessmentId(
  //       thisAssessment.id
  //     );
  //     console.log("reponse", questionsResponse);
  //     const questionsData = questionsResponse?.payload || [];
  //     setQuestions(questionsData);
  //     // } catch (err) {
  //     //   console.error("Failed to fetch assessment details", err);
  //     //   setError("Failed to load assessment details");
  //     // } finally {
  //     //   setIsLoading(false);
  //     // }

  //     const categoryResponse = await getAllQuestionCategories();
  //     const categoryData = categoryResponse?.payload || [];

  //     // filter categories based on current assessment id
  //     const filteredCategories = categoryData.filter(
  //       (cat) => cat.assessmentId?.toString() === id
  //     );

  //     setCategories(filteredCategories);
  //     console.log(filteredCategories);
  //   } catch (err) {
  //     console.error("Failed to fetch assessment details", err);
  //     setError("Failed to load assessment details");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, [id]);

  // const handleSave = (newQ) => {
  //   if (editingQuestion) {
  //     setQuestions((prev) =>
  //       (prev ?? []).map((q) =>
  //         q.id === editingQuestion.id ? { ...q, ...newQ } : q
  //       )
  //     );
  //     setEditingQuestion(null);
  //   } else {
  //     setQuestions((prev) => [...(prev ?? []), newQ]);
  //   }
  //   setIsModalOpen(false);
  // };

  // const handleDelete = async (id) => {
  //   try {
  //     await deleteQuestion(id);
  //     setQuestions((prev) => prev.filter((q) => q.id !== id));
  //   } catch (err) {
  //     console.error("Failed to delete question", err);
  //   }
  // };

  // const handleEdit = (question) => {
  //   setEditingQuestion(question);
  //   setIsModalOpen(true);
  // };

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


 if (isLoading) {
    return (
      <section className="h-[90vh] flex flex-col justify-center items-center">
        <div className="custom-loader"></div>
        <p className="mt-4 text-sm text-gray-500">Loading assessments details...</p>
      </section>
    );
  }

  return (
    <section className="">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-semibold "> {initialAssessment.name}</h2>
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
      <p className="text-xs text-secondary mb-2">
        {initialAssessment.description}
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
        <strong>Price </strong>£ {priceMap[assessment?.priceId] ?? "Free"}
      </p>
      <hr />

      {/* Category Grid */}
      <h3 className="font-medium my-3">Question Category List</h3>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5  ">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between relative  rounded-xl hover:shadow-md p-3 h-[130px] bg-[#eefafc]"
            >
              <div className="">
                <h4 className="font-semibold text-sm ">{cat.name}</h4>
                <p className="text-xs mb-1 text-gray-700">{cat.variant}</p>
              </div>
              <div className="flex  justify-between  item-center">
                <button
                  onClick={() =>
                    navigate(`/initial/${id}/category/${cat.id}`, {
                      state: {
                        assessmentId: id,
                        categoryId: cat.id,
                        categoryName: cat.name,
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


      {/* 
      <h3 className="font-medium my-3">Question List</h3>
      <div className="h-[70vh] overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-700">
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
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
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
