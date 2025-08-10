import React from "react";
import { useNavigate } from "react-router-dom";
import { users, children, assessments } from "../../Components/utils/Data";
import SubmittedInitials from "../../Components/SubmittedAssessments/SubmittedInitials";

const SubmittedInitialList = () => {
  const navigate = useNavigate();
  const initialAssessments = assessments.filter((a) => a.type === "initial");

 const handleView = (assessmentId) => {
  navigate(`/submitted-assessments/initial/${assessmentId}`);
};

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 ">
      <h1 className="text-2xl font-medium ">
        Submitted Initial Assessments
      </h1>
      <p className="text-sm mb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <p className="mb-4">Total submitted: {initialAssessments.length}</p>

      <SubmittedInitials
        assessments={initialAssessments}
        users={users}
        children={children}
        onView={handleView}
      />
    </section>
  );
};

export default SubmittedInitialList;
