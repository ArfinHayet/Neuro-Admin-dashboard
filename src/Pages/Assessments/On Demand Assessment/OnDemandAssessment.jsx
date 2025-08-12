import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onDemandAssessments } from "../../../Components/utils/Data";
import CategoryModal from "../../../Components/Common/CategoryModal";
import { FaRegClock } from "react-icons/fa6";

const CategoryCard = ({ category, onSelect }) => {
  return (
    <section>
      <div
        className="bg-[#eeeeee] rounded-xl p-6 cursor-pointer hover:shadow-md flex flex-col justify-between gap-2 h-[280px]"
        style={{ backgroundColor: category.bgColor }}
      >
        <img
          src={category.image}
          alt={category.title}
          className="h-[60px] mx-auto"
        />
        <h2 className="text-lg font-semibold text-center">{category.title}</h2>
        <p className="text-sm text-center">{category.description}</p>
        <span className="flex items-center gap-1 justify-center">
          <FaRegClock />
          <p className="text-sm text-center">{category.time}</p>
        </span>
        <div className="flex justify-center pt-4">
          {/* <button
            onClick={() => onEdit(category.id)}
            className="text-sm text-blue-600 underline"
          >
            Edit
          </button> */}

          <button
            onClick={() => onSelect(category)}
            className="bg-[#114654] text-white text-xs py-2 px-3 rounded-full "
          >
            Show Details
          </button>
        </div>
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
        <h1 className="text-2xl font-medium">On-Demand Assessments</h1>
        <button
          className="bg-[#114654] text-white px-4 py-2 rounded-full"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        >
          Add New Category
        </button>
      </div>
      <p className="text-sm mb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        defaultCategory={editingCategory}
      />
    </section>
  );
};

export default OnDemandAssessment;
