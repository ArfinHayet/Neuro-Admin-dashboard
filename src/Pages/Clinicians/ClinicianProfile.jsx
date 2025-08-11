import React from 'react';
import { useParams } from "react-router-dom";
import CliniciansProfile from '../../Components/Clinicians/CliniciansProfile';
import { clinicians } from '../../Components/utils/Data';


const ClinicianProfile = () => {
   const { id } = useParams();
  const clinician = clinicians.find((c) => c.id.toString() === id);

  if (!clinician) {
    return <p className="p-4">Clinician not found.</p>;
  }

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 pb-20">
       <div className="flex items-center gap-6">
        <img
          src={clinician.image}
          alt={clinician.name}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold mb-1">{clinician.name}</h2>
          <p className="text-sm text-gray-600 ">{clinician.title}</p>
          <p className="text-sm text-gray-500">
            Joined on {new Date(clinician.joinedDate).toLocaleDateString("en-GB")}
          </p>
          {clinician.specialities && (
            <p className="text-sm text-gray-700 mt-2">
              <strong>Specialities </strong> {clinician.specialities.join(", ")}
            </p>
          )}
          {clinician.bio && (
            <p className="text-sm text-gray-700 mt-2 max-w-xl">{clinician.bio}</p>
          )}
          {clinician.registrationInfo && (
            <p className="text-sm text-gray-700 mt-2">
              <strong>Registration Info </strong> {clinician.registrationInfo}
            </p>
          )}
        </div>
      </div>

      <CliniciansProfile clinician={clinician} />
    </section>
  )
}

export default ClinicianProfile;