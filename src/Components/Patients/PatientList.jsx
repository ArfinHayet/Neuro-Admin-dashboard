import React from "react";
//import PatientTransaction from "./PatientTransaction";
import { Link } from "react-router-dom";

const PatientList = ({ patients }) => {
  return (
    <section>
      <div className="grid gap-0 w-[75vw] rounded-xl divide-y bg-white">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="py-4 px-5  flex items-center gap-4"
          >
            <img
              src={patient.image}
              alt={patient.name}
              className="w-14 h-14 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{patient.name}</h3>
              <p className="text-sm text-gray-600">Age: {patient.age}</p>
            </div>
            <Link
              to={`/patients/${patient.id}`}
              className="px-3 py-1 bg-[#114654] text-white text-sm rounded-full"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PatientList;

