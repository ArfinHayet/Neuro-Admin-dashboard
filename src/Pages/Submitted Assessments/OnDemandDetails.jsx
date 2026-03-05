import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getAllanswers } from "../../api/answers";
import { getAllAppointments } from "../../api/appointments";
import { getUserById } from "../../api/user";
import ManuallyClinicianAssign from "./ManuallyClinicianAssign";
import { TiInputChecked } from "react-icons/ti";

const groupAnswersByType = (answersRaw = []) => {
  const grouped = {};

  answersRaw.forEach((item) => {
    const typeName = (
      item.question?.questionType?.name ||
      item.question?.questionType ||
      item.questionType ||
      "Unknown"
    ).trim();

    if (!grouped[typeName]) {
      grouped[typeName] = {
        name: typeName,
        answers: [],
      };
    }

    grouped[typeName].answers.push({
      question:
        item.question?.questions ||
        item.question?.questionText ||
        "No question",
      answer: item.answer || "No answer",
      variant: item.question?.variant,
      extraInfo: item.extraInfo,
    });
  });

  return grouped;
};

const OnDemandDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const passedSubmissions = state?.submissions || [];
  const [selectedSubmission, setSelectedSubmission] = useState(
    passedSubmissions[0] || null,
  );

  const [groupedAnswers, setGroupedAnswers] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [allAnswers, setAllAnswers] = useState({});

  const [appointments, setAppointments] = useState([]);
  const [matchedAppointment, setMatchedAppointment] = useState(null);
  const [clinicianDetails, setClinicianDetails] = useState(null);
  const [deletemodal, setdeletemodal] = useState(false);

  const [showClinicianModal, setShowClinicianModal] = useState(false);

  const fetchAnswers = async () => {
    if (!selectedSubmission) return;

    const patientId =
      selectedSubmission.patient?.id || selectedSubmission.patientId;
    const assessmentId = selectedSubmission.assessmentId;

    if (!patientId || !assessmentId) return;

    try {
      setIsLoading(true);

      // ✅ getAllanswers API দিয়ে fetch করছি
      const res = await getAllanswers({ patientId, assessmentId });
      const answersRaw = res?.payload || [];

      const grouped = groupAnswersByType(answersRaw);
      setGroupedAnswers(grouped);
      setSelectedType(Object.keys(grouped)[0] || null);
    } catch (err) {
      console.error("Error fetching answers:", err);
      setGroupedAnswers({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [selectedSubmission]);

  const handleAssignSuccess = async (newClinicianId) => {
    setSelectedSubmission((prev) => ({
      ...prev,
      clinicianId: newClinicianId,
    }));

    // re-fetch answers after reassign
    await fetchAnswers();

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

  return (
    <section className="space-y-3 pb-14">
      <div className="relative">
        <h1 className="text-xl font-semibold mb-2">
          {selectedSubmission.assessment?.category || "Assessment"} Submission
          Details
        </h1>
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
        <button
          onClick={() => setdeletemodal(true)}
          className="absolute top-6 right-4 px-3 py-2 text-xs text-red-600  bg-red-200/80 rounded-full hover:bg-red-200"
        >
          Delete
        </button>
      </div>

      {/* Question Type Buttons */}
      <div className="relative flex gap-2 flex-wrap mt-2">
        {Object.entries(groupedAnswers).map(([typeId, data]) => {
          const isExternalType = data.answers.some(
            (a) => a.variant === "external",
          );

          return (
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
              {isExternalType && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold ml-2">
                  External
                </span>
              )}
            </button>
          );
        })}

       
      </div>

      {groupedAnswers[selectedType]?.answers?.some(
        (a) => a.variant === "external",
      ) && (
        <div className="p-3 border rounded-md bg-amber-50 text-xs space-y-1  mb-3">
          <p>
            <span className="font-semibold">Reviewer Name </span>
            {selectedSubmission.reviewer_name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Occupation </span>
            {selectedSubmission.reviewer_occupation || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Relation </span>
            {selectedSubmission.reviewer_relation || "N/A"}
          </p>
        </div>
      )}

      <div className="relative text-sm border rounded-lg p-3">
        {/* Questions & Answers */}
        <div className="mt-4 space-y-4 text-xs">
          {selectedType && groupedAnswers[selectedType]?.answers?.length > 0 ? (
            groupedAnswers[selectedType].answers.map((ans, i) => {
              const isExternal = ans.variant === "external";

              if (isExternal) {
                return (
                  <div
                    key={i}
                    className="p-3 border rounded-md bg-blue-50 space-y-1"
                  >
                    <p className="font-medium text-gray-800">
                      Q: {ans.question}
                    </p>
                    <p>
                      <span className="font-semibold">Answer: </span>
                      {ans.answer}
                    </p>
                  </div>
                );
              }

              return (
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
              );
            })
          ) : (
            <p className="text-center text-gray-500 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl">
              No answers submitted yet for this question type.
            </p>
          )}
        </div>

        {/* AI Summary */}
        <div>
          <h2 className="mt-6 font-semibold mb-3 text-lg">AI Summary</h2>

          {selectedType && (
            <div>
              <p className="text-sm font-semibold text-[#4B4B4B] mb-1">
                {selectedType}
              </p>
              <p className="text-xs text-gray-500 text-justify whitespace-pre-line">
                {passedSubmissions
                  .find(
                    (item) =>
                      item.questionType?.trim().toLowerCase() ===
                      selectedType?.trim().toLowerCase(),
                  )
                  ?.summary?.replace(/[*#_`>]+/g, "")
                  ?.replace(/-{3,}/g, "")
                  ?.trim() || "No summary available for this section."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Clinician Details */}
      <div className="text-sm border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">Clinician Details</h2>

          {!selectedSubmission.clinician_approved && (
            <button
              onClick={() => setShowClinicianModal(true)}
              className="px-4 py-1 bg-[#114654] text-white rounded-md text-sm hover:bg-[#0d3640]"
            >
              {selectedSubmission.clinicianId ? "Reassign" : "Assign"} Clinician
            </button>
          )}
        </div>

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

        {clinicianDetails && (
          <div className="space-y-1 mt-2">
            {clinicianDetails.name && (
              <p>
                <span className="font-semibold">Clinician Name </span>
                {clinicianDetails.name}
              </p>
            )}
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

      {/* Appointments */}
      {matchedAppointment && (
        <div className="text-sm mt-6 border rounded-md p-3">
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
