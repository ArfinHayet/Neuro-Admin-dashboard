//import {useState} from "react";
import { clinicians } from "../../Components/utils/Data";
import ClinicianList from "../../Components/Clinicians/ClinicianList";


const Clinicians = () => {
  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 pb-20">
      <h1 className="font-medium text-2xl mb-4">Clinicians</h1>
      <ClinicianList clinicians={clinicians} />
    </section>
  );
};

export default Clinicians;
