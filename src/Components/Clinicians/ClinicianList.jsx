import React from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";

const ClinicianList = ({ clinicians }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg px-2 w-[80vw] overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-center">
        <thead className="py-2 ">
          <tr>
            <th scope="col" className="pl-12 py-3 text-left  font-medium ">
              Clinician
            </th>
            <th scope="col" className="px-6 py-3   font-medium  ">
              Status
            </th>
            <th scope="col" className="px-6 py-3   font-medium   ">
              Cases Taken
            </th>
            <th scope="col" className="px-6 py-3  font-medium  ">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clinicians.map((clinician) => (
            <tr key={clinician.id} className="">
              <td className="px-6 py-4 ">
                <div className="flex items-start">
                  <div className=" h-10 w-10">
                    <img
                      src={clinician.image}
                      alt={clinician.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="ml-4 text-left">
                    <div className=" font-medium text-gray-900">
                      {clinician.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {clinician.title}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    clinician.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {clinician.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {clinician.casesTaken} Cases
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => navigate(`/clinicians/${clinician.id}`)}
                  className="text-sm bg-primary text-white rounded-full px-3 py-1 hover:bg-primary-dark"
                >
                  View profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClinicianList;