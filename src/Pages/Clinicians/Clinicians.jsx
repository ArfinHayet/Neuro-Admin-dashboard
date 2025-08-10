import {useState} from "react";
import { clinicians } from "../../Components/utils/Data";
import ClinicianStats from "../../Components/Clinicians/ClinicanStats";
import ClinicianList from "../../Components/Clinicians/ClinicianList";

import { clinicianRequests, leaveRequests, upcomingLeaves } from "../../Components/utils/Data";


const Clinicians = () => {
   const [requests, setRequests] = useState(clinicianRequests);
  const [showInviteModal, setShowInviteModal] = useState(false);

   const handleApprove = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleInvite = (newInvite) => {
    console.log("Inviting:", newInvite);
    setShowInviteModal(false);
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 pb-20">
      <h1 className="font-medium text-2xl mb-4">Clinicians</h1>
      <ClinicianList clinicians={clinicians} />
    </section>
  );
};

export default Clinicians;
