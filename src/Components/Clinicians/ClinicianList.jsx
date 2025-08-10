import React from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";


const ClinicianList = ({ clinicians }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg px-2 w-[80vw] grid grid-cols-1 divide-y">
      {clinicians.map((clinician) => (
        <div
          key={clinician.id}
          className="p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <img
              src={clinician.image}
              alt={clinician.name}
              className="w-14 h-14 rounded-full"
            />
            <div>
              <span className="flex gap-4 ">
                <p className="font-semibold">{clinician.name}</p>
                <button
              onClick={() => navigate(`/clinicians/${clinician.id}`)}
                  className="text-sm bg-primary text-white rounded-full px-3 py-1"
                >
                  View profile
                </button>
              </span>
              <p className="text-sm text-gray-500">{clinician.title}</p>
            </div>
          </div>

          <div className="text-right">
            <p
              className={`font-bold ${
                clinician.status === "active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {clinician.status}
            </p>
            <p className="text-sm text-gray-600">
              {clinician.casesTaken} Cases
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClinicianList;
