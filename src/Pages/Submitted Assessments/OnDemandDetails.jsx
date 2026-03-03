import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getAnswersByPatientAndAssessment } from "../../api/answers";
import { getAllAppointments } from "../../api/appointments";
import { getUserById } from "../../api/user";
import { HiOutlineDotsVertical } from "react-icons/hi";
import ManuallyClinicianAssign from "./ManuallyClinicianAssign";
import { TiInputChecked } from "react-icons/ti";

const groupAnswersByType = (submissions = []) => {
  const grouped = {};

  submissions.forEach((sub) => {
    const typeName = (sub.questionType || "Unknown").trim();

    if (!grouped[typeName]) {
      grouped[typeName] = {
        name: typeName,
        answers: [],
      };
    }

    // Check if this submission has multiple questions (nested array)
    if (Array.isArray(sub.questions) && sub.questions.length > 0) {
      sub.questions.forEach((q) => {
        grouped[typeName].answers.push({
          question: q.questions || q.questionText || "No question",
          answer: q.answer || "No answer",
        });
      });
    } else {
      // fallback: single question in top-level
      grouped[typeName].answers.push({
        question: sub.questions || sub.question?.questions || "No question",
        answer: sub.answer || sub.question?.answer || "No answer",
      });
    }
  });

  return grouped;
};



const OnDemandDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const passedSubmissions = state?.submissions || []; // note: array of submissions
  const [selectedSubmission, setSelectedSubmission] = useState(
    passedSubmissions[0] || null,
  );
  console.log("passesd submissions", passedSubmissions);

  const [groupedAnswers, setGroupedAnswers] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [allAnswers, setAllAnswers] = useState({});

  const [appointments, setAppointments] = useState([]);
  const [matchedAppointment, setMatchedAppointment] = useState(null);
  const [clinicianDetails, setClinicianDetails] = useState(null);
  const [deletemodal, setdeletemodal] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const [showClinicianModal, setShowClinicianModal] = useState(false);

  const fetchAnswers = async () => {
    if (!passedSubmissions?.length) return;

    try {
      setIsLoading(true);

      const grouped = groupAnswersByType(passedSubmissions);

      setGroupedAnswers(grouped);
      setSelectedType(Object.keys(grouped)[0] || null);
    } catch (err) {
      console.error("Error grouping answers:", err);
      setGroupedAnswers({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [passedSubmissions]);

  // const handleAssignSuccess = async () => {
  //   const res = await getAnswersByPatientAndAssessment(
  //     selectedSubmission.patient.id,
  //     selectedSubmission.assessmentId,
  //     { limit: 100 },
  //   );

  //   const ans = res?.payload || [];

  //   const grouped = groupAnswersByType(ans);
  //   setGroupedAnswers(grouped);

  //   if (selectedSubmission.clinicianId) {
  //     const clinicianRes = await getUserById(selectedSubmission.clinicianId);
  //     setClinicianDetails(clinicianRes?.payload || null);
  //   }
  // };

  const handleAssignSuccess = async (newClinicianId) => {
    setSelectedSubmission((prev) => ({
      ...prev,
      clinicianId: newClinicianId,
    }));

    const res = await getAnswersByPatientAndAssessment(
      selectedSubmission.patient.id,
      selectedSubmission.assessmentId,
      { limit: 100 },
    );

    const ans = res?.payload || [];
    const grouped = groupAnswersByType(ans);
    setGroupedAnswers(grouped);

    if (newClinicianId) {
      try {
        const clinicianRes = await getUserById(newClinicianId);
        setClinicianDetails(clinicianRes?.payload || null);
      } catch (err) {
        console.error("Failed to fetch new clinician details:", err);
        setClinicianDetails(null);
      }
    } else {
      setClinicianDetails(null);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAllAppointments();
        const allAppts = res?.payload || [];
        setAppointments(allAppts);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (!selectedSubmission || appointments.length === 0) return;

    const matched = appointments.find(
      (appt) =>
        appt.clinicianId === selectedSubmission.clinicianId &&
        appt.patientId === selectedSubmission.patientId,
    );

    setMatchedAppointment(matched || null);
  }, [selectedSubmission, appointments]);

  useEffect(() => {
    const fetchClinician = async () => {
      if (!selectedSubmission?.clinicianId) {
        setClinicianDetails(null);
        return;
      }

      try {
        const res = await getUserById(selectedSubmission.clinicianId);
        console.log(res);
        setClinicianDetails(res?.payload || null);
      } catch (err) {
        console.error("Error fetching clinician details:", err);
        setClinicianDetails(null);
      }
    };

    fetchClinician();
  }, [selectedSubmission]);

  if (isLoading) {
    return (
      <section className="h-[90vh] flex flex-col justify-center items-center">
        <div className="custom-loader"></div>
        <p className="mt-4 text-sm text-gray-500">
          Loading Submission Details...
        </p>
      </section>
    );
  }

  if (!selectedSubmission) return <p>Submission not found.</p>;

  const questionTypes = Object.keys(groupedAnswers);

  return (
    <section className="space-y-3 pb-14">
      <div>
        <h1 className="text-xl font-semibold mb-2 ">
          {selectedSubmission.assessment?.category || "Assessment"} Submission
          Details
        </h1>
        {/* Basic info */}
        <div className="text-sm space-y-1 pb-2">
          <p>
            <span className="font-semibold">User Name </span>
            {selectedSubmission.user?.name}
          </p>
          <p>
            <span className="font-semibold">Patient Name </span>
            {selectedSubmission.patient?.name}
          </p>
          <p>
            <span className="font-semibold">Clinician </span>
            {selectedSubmission.clinicianId ? "Assigned" : "Not assigned"}
          </p>

          <p>
            <span className="font-semibold">Status </span>
            {selectedSubmission.status}
          </p>
        </div>
      </div>

      {/* Question Type Buttons */}
      <div className="relative flex gap-2 flex-wrap mt-2">
        {Object.entries(groupedAnswers).map(([typeId, data]) => (
          <button
            key={typeId}
            onClick={() => setSelectedType(typeId)}
            className={`px-4 py-2 rounded-full text-xs font-medium ${
              selectedType === typeId
                ? "bg-[#114654] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {data.name}
          </button>
        ))}

        <HiOutlineDotsVertical
          size={18}
          className="absolute right-2 top-2 cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        />
      </div>
      {showMenu && (
        <div className="absolute right-2 top-8 bg-white border rounded shadow-md z-10">
          <button
            onClick={() => {
              setdeletemodal(true);
              setShowMenu(false);
            }}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left"
          >
            Delete
          </button>
        </div>
      )}
      <div className="relative  text-sm border rounded-lg p-3 ">
        {/* Questions & answers for selected type */}
        <div className="mt-4 space-y-4 text-xs">
          {selectedType && groupedAnswers[selectedType]?.answers?.length > 0 ? (
            groupedAnswers[selectedType].answers.map((ans, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b p-4 bg-white"
              >
                <div className="flex justify-between items-start w-full">
                  <p className="font-medium text-gray-800">{ans.question}</p>
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
                    <p className="text-secondary mt-1">{ans.answer}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl">
              No answers submitted yet for this question type.
            </p>
          )}
        </div>

        {/* Summary */}

        <h2 className="mt-6 font-semibold mb-2 text-lg">AI Summary</h2>

        <p className="mt-1 text-gray-700 whitespace-pre-line text-sm">
          {selectedSubmission.summary
            ? selectedSubmission.summary.replace(/\*/g, "")
            : "No summary available."}
        </p>
      </div>

      {/* clinician details */}

      <div className=" text-sm border rounded-lg p-3 ">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">Clinician Details</h2>

          {/* Show assign/reassign button if not approved */}
          {!selectedSubmission.clinician_approved && (
            <button
              onClick={() => setShowClinicianModal(true)}
              className="px-4 py-1 bg-[#114654] text-white rounded-md text-sm hover:bg-[#0d3640]"
            >
              {selectedSubmission.clinicianId ? "Reassign" : "Assign"} Clinician
            </button>
          )}
        </div>

        {/* Status */}
        <div className="mb-3 p-2 rounded-md bg-gray-100">
          <p className="text-sm">
            <span className="font-semibold">Status </span>
            {selectedSubmission.clinician_approved ? (
              <span className="text-green-700 font-medium">
                <TiInputChecked size={20} /> Approved
              </span>
            ) : selectedSubmission.clinicianId ? (
              <span className="text-orange-600 font-medium">
                Assigned (Pending Approval)
              </span>
            ) : (
              <span className="text-gray-500 font-medium">Not Assigned</span>
            )}
          </p>
        </div>

        {/* Show clinician details if assigned */}
        {clinicianDetails && (
          <div className="space-y-1 mt-2">
            {clinicianDetails.name && (
              <p>
                <span className="font-semibold">Clinician Name </span>
                {clinicianDetails.name}
              </p>
            )}
            {/* {clinicianDetails.email && (
              <p>
                <span className="font-semibold">Email </span>
                {clinicianDetails.email}
              </p>
            )} */}
            {clinicianDetails.hcpcTitle && (
              <p>
                <span className="font-semibold">HCPC Title </span>
                {clinicianDetails.hcpcTitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Clinician Assignment Modal */}
      <ManuallyClinicianAssign
        show={showClinicianModal}
        onClose={() => setShowClinicianModal(false)}
        submissionIds={passedSubmissions.map((s) => s.id)}
        onSuccess={handleAssignSuccess}
      />

      {/* appointments */}
      {matchedAppointment && (
        <div className=" text-sm mt-6 border rounded-md p-3 ">
          <h2 className="font-semibold mb-1 text-lg">Scheduled Appointment</h2>
          <p>
            <span className="font-semibold">Date & Time </span>
            {new Date(matchedAppointment.time).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Meeting Link </span>
            <a
              href={matchedAppointment.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {matchedAppointment.link}
            </a>
          </p>
          <p>
            <span className="font-semibold">Meeting ID </span>
            {matchedAppointment.meetingId}
          </p>
          <p>
            <span className="font-semibold">Password </span>
            {matchedAppointment.meetingPassword}
          </p>
          <p>
            <span className="font-semibold">Status </span>
            {matchedAppointment.status} / {matchedAppointment.metting_status}
          </p>
        </div>
      )}
    </section>
  );
};

export default OnDemandDetails;
