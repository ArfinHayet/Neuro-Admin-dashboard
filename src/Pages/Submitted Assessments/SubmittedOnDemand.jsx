import React from "react";
import { useNavigate } from "react-router-dom";
import { assessments, users, children, categories } from "../../Components/utils/Data";
import SubmittedOnDemandList from "../../Components/SubmittedAssessments/SubmittedOnDemandList";

const SubmittedOnDemand = () => {
  const navigate = useNavigate();
  const onDemandAssessments = assessments.filter((a) => a.type === "on-demand");

    const onView = (id) => {
navigate(`/on-demand-assessment/${id}`);
  };


  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <h1 className="text-2xl font-medium ">Submitted On-Demand Assessments</h1>
       <p className="text-sm mb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>

      <p className="mb-4">Total submitted: {onDemandAssessments.length}</p>

      <SubmittedOnDemandList
        assessments={onDemandAssessments}
        users={users}
        children={children}
        categories={categories}
        onView={onView}
      />
    </section>
  );
};

export default SubmittedOnDemand;
