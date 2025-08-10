
import React , { useState } from "react";
import { onDemandAssessments } from "../../../Components/utils/Data";
import CategoryCard from "../../../Components/OnDemandAssessment/CategoryCard";
import { useNavigate } from "react-router-dom";
import CategoryModal from "../../../Components/OnDemandAssessment/CategoryModal"; 


const OnDemandAssessment = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
  const [ setCategories] = useState(onDemandAssessments);
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
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium ">On-Demand Assessments</h1>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {onDemandAssessments.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={() => alert("Edit category")}
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
