import React from "react";
import { useParams } from "react-router-dom";
import { clinicians } from "../utils/Data"; 

const CliniciansProfile = () => {
  const { id } = useParams();
  const clinician = clinicians.find((c) => c.id.toString() === id);

  if (!clinician) {
    return <p className="p-4">Clinician not found.</p>;
  }

  return (
    <div className="bg-white rounded-lg p-6 w-[70vw] mx-auto">
      <div className="flex items-center gap-6">
        <img
          src={clinician.image}
          alt={clinician.name}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{clinician.name}</h2>
          <p className="text-gray-600">{clinician.title}</p>
          <p className="text-sm text-gray-500">
            Joined: {new Date(clinician.joinedDate).toLocaleDateString("en-GB")}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold">Cases Taken</h3>
          <p>{clinician.casesTaken}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold">Cases Completed</h3>
          <p>{clinician.casesCompleted}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold">Total Earnings</h3>
          <p>${clinician.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold">Pending Amount</h3>
          <p>${clinician.pendingAmount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CliniciansProfile;
