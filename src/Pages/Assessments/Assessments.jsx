import InitialAssessment from "../../Components/Assessments/InitialAssessment";
import OnDemandAssessment from "../../Components/Assessments/OnDemandAssessment";

const Assessments = () => {
  return (
    <div className="bg-white rounded-3xl h-[90vh] overflow-y-auto px-6 pt-5 pb-5">
      <InitialAssessment />
      <OnDemandAssessment />
    </div>
  );
};

export default Assessments;