import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onDemandAssessments } from "../../../Components/utils/Data";
import { FaRegClock } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import AddNewCategoryModal from "../../../Components/Assessments/AddNewCategoryModal";

const CategoryCard = ({ category, onEdit, onSelect }) => {
  return (
    <section>
      <div className="bg-[#eeeeee] rounded-xl p-6 cursor-pointer hover:shadow-md flex flex-col gap-2  h-[240px]">
        <img
          src={category.image}
          alt={category.name}
          className="h-[50px] mx-auto"
        />
        <h2 className=" font-semibold text-center ">{category.name}</h2>
        <p className="text-xs text-secondary text-center ">
          {category.description}
        </p>
        <span className="flex items-center gap-1 justify-center">
          <FaRegClock size={14} />
          <p className="text-xs text-center">{category.time}</p>
        </span>
        <div className="flex justify-center">
          <button
            onClick={() => onSelect(category)}
            className="bg-[#114654] text-white text-xs py-1.5 px-3 rounded-full w-fit "
          >
            Show Details
          </button>
        </div>
        <button
          onClick={() => onEdit(category.id)} title="Edit Category"
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
  const [categories, setCategories] = useState(onDemandAssessments);
  const [editingCategory, setEditingCategory] = useState(null);

  const navigate = useNavigate();

  const handleCardClick = (categoryId) => {
    navigate(`/ondemandassessment/${categoryId}`);
  };

  const handleSaveCategory = (newCategory) => {
    if (editingCategory) {
      // Edit existing
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...newCategory } : cat
        )
      );
      setEditingCategory(null);
    } else {
      // Add new
      setCategories((prev) => [...prev, { id: Date.now(), ...newCategory }]);
    }
    setIsModalOpen(false);
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">On-Demand Assessments</h1>
        <button
          className="bg-[#114654] text-white px-4 py-2 rounded-full text-sm"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        >
          Add New Category
        </button>
      </div>
      <p className="text-sm text-secondary mb-6">
        View and edit On-Demand Assessments category to .
      </p>

      <div className="grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={() => {
              setEditingCategory(category);
              setIsModalOpen(true);
            }}
            onSelect={() => handleCardClick(category.id)}
          />
        ))}
      </div>

      <AddNewCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        defaultCategory={editingCategory}
      />
    </section>
  );
};

export default OnDemandAssessment;
