import {useState} from "react";
import { clinicians } from "../../Components/utils/Data";
import ClinicianStats from "../../Components/Clinicians/ClinicanStats";
import ClinicianList from "../../Components/Clinicians/ClinicianList";
import ApprovalsList from "../../Components/Clinicians/ApprovalList";
import LeaveManagement from "../../Components/Clinicians/LeaveManagement";
import InvitationModal from "../../Components/Clinicians/InvitationModal";
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
      <h1 className="font-medium text-3xl mb-8">Clinicians</h1>
      <ClinicianStats clinicians={clinicians} />
      <div className="flex flex-col justify-start gap-10">
        <ClinicianList clinicians={clinicians} />
     
      <ApprovalsList
        requests={requests}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      <LeaveManagement
        leaveRequests={leaveRequests}
        upcomingLeaves={upcomingLeaves}
      />
      <InvitationModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
      /> 
      </div>
    </section>
  );
};

export default Clinicians;
