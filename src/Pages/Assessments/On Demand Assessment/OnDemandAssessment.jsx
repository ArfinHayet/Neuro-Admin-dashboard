import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { onDemandAssessments } from "../../../Components/utils/Data";
import { FaRegClock } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import AddNewCategoryModal from "../../../Components/Assessments/AddNewCategoryModal";
import { createAssessment, getAssessments } from "../../../api/assessments";
import CategoryModal from "../../../Components/Assessments/CategoryModal";

const AssessmentCard = ({ category, onEdit, onSelect }) => {
  return (
    <section>
      <div className="bg-[#eeeeee] rounded-xl p-6 cursor-pointer hover:shadow-md flex flex-col gap-2  h-[240px]">
        <h2 className=" font-semibold text-center ">{category.category}</h2>
        <p className="text-xs text-secondary text-center ">{category.description}</p>
        <span className="flex items-center gap-1 justify-center">
          <FaRegClock size={14} />
          <p className="text-xs text-center">{category.totalTime}</p>
        </span>
        <p className="text-xs text-center capitalize">{category.type}</p>

        <div className="flex justify-center">
          <button
            onClick={() => onSelect(category)}
            className="bg-[#114654] text-white text-xs py-1.5 px-3 rounded-full w-fit "
          >
            Show Details
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category.id);
          }}
          title="Edit Category"
          className="text-blue-600 underline flex justify-end  items-center -mt-2"
        >
          <FiEdit3 />
        </button>
      </div>
    </section>
  );
};


const OnDemandAssessment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessments, setAssessments] = useState([]); 
   const [editingAssessments, setEditingAssessments] = useState(null);

 // const [categories, setCategories] = useState([]);
  // const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

   const fetchAssessments = async () => {
    try {
      const response = await getAssessments();
      const data = Array.isArray(response) ? response : [];
      setAssessments(data); // updated
    } catch (err) {
      setError("Failed to load assessments");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleCardClick = (category) => {
    navigate(`/ondemandassessment/${category.id}`);
  };

   const handleSaveCategory = async (newCategory) => {
    try {
      setIsLoading(true);
      const savedCategory = await createAssessment(newCategory);

      const normalizedCategory = {
        id: savedCategory.id,
        category: savedCategory.category || savedCategory.name || "",
        description: savedCategory.description || "",
        type: savedCategory.type || "",
        totalTime: savedCategory.totalTime || "",
      };

      if (editingAssessments) {
        setAssessments((prev) =>
          prev.map((cat) =>
            cat.id === editingAssessments.id ? normalizedCategory : cat
          )
        );
      } else {
        setAssessments((prev) => [...prev, normalizedCategory]);
      }

      setIsModalOpen(false);
      setEditingAssessments(null); 
    } catch (err) {
      setError("Failed to save assessment");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // if (isLoading) {
  //   return (
  //     <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2">
  //       <div className="bg-white p-2 rounded-md h-[88vh] flex justify-center items-center">
  //         <p>Loading assessments...</p>
  //       </div>
  //     </section>
  //   );
  // }

  if (error) {
    return { error };
  }

  return (
   <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">On-Demand Assessments</h1>
          <button
            className="bg-[#114654] text-white px-4 py-2 rounded-full text-sm"
            onClick={() => {
              setEditingAssessments(null);
              setIsModalOpen(true);
            }}
          >
            Add New Category
          </button>
        </div>
        <p className="text-sm text-secondary mb-6">
          View, Edit and manage questions for the Initial Assessment to ensure
          accuracy and relevance.
        </p>

        <div className="grid grid-cols-4 gap-4">
          {assessments.map((category) => (
            <AssessmentCard
              key={category.id}
              category={category}
              onEdit={(category) => {
                setEditingAssessments(category);
                setIsModalOpen(true);
              }}
              onSelect={handleCardClick}
            />
          ))}
        </div>

        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => {setIsModalOpen(false);
            setEditingAssessments(null);
          }}
          onSave={handleSaveCategory}
          defaultCategory={editingAssessments}
        />
      </div>
    </section>
  );
};

export default OnDemandAssessment;
