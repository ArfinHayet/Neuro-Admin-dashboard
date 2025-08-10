// OnDemandAssessment.jsx
import React from "react";
import { onDemandAssessments } from "../../../Components/utils/Data";
import CategoryCard from "../../../Components/OnDemandAssessment/CategoryCard";
import { useNavigate } from "react-router-dom";

const OnDemandAssessment = () => {
  const navigate = useNavigate();

  const handleCardClick = (categoryId) => {
    navigate(`/ondemandassessment/${categoryId}`);
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5">
      <h1 className="text-3xl font-semibold mb-6">On-Demand Assessments</h1>
      <div className="flex justify-end">
        <button className="bg-[#114654] text-white px-4 py-2 rounded-full">
          Add Assessment
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
    </section>
  );
};

export default OnDemandAssessment;
