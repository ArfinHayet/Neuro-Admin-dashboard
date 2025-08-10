import { onDemandAssessments } from "../utils/Data";
import AssessmentCard from "./AssessmentCard";

const OnDemandAssessment = () => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">On-demand Assessments</h2>
        <button className="bg-[#114654] text-white px-4 py-2 rounded"> Add Assessment</button>
      </div>
      <div className="flex flex-wrap gap-4">
        {onDemandAssessments.map((a) => (
          <AssessmentCard key={a.id} assessment={a} />
        ))}
      </div>
    </div>
  );
};

export default OnDemandAssessment;
