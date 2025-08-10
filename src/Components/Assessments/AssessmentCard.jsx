import React from "react";

const AssessmentCard = ({ assessment }) => {
  return (
    <div className=" p-4 rounded shadow w-full md:w-[300px]">
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-2xl">{assessment.icon}</span>
        <h3 className="text-lg font-semibold">{assessment.title}</h3>
      </div>
      <img src={assessment.image} alt="icon" className="w-full h-24 object-cover rounded mb-2" />
      <p className="text-sm text-gray-600">{assessment.description}</p>
      <p className="text-sm mt-1">⏱ {assessment.time}</p>
      <div className="flex justify-between mt-3">
        <button className="text-blue-600 text-sm">Edit</button>
        <button className="text-red-600 text-sm">Delete</button>
      </div>
    </div>
  );
};

export default AssessmentCard;
