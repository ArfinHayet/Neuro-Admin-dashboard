

import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getAllanswers } from "../../api/answers";
import { getAllAppointments } from "../../api/appointments";
import { getUserById } from "../../api/user";
import ManuallyClinicianAssign from "./ManuallyClinicianAssign";
import { TiInputChecked } from "react-icons/ti";

const normalizeType = (str) => str?.trim().toLowerCase() || "";

const OnDemandDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const passedSubmissions = state?.submissions || [];

  const [selectedSubmission, setSelectedSubmission] = useState(
    passedSubmissions[0] || null,
  );

  const [answers, setAnswers] = useState({});
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [matchedAppointment, setMatchedAppointment] = useState(null);
  const [clinicianDetails, setClinicianDetails] = useState(null);
  const [deletemodal, setdeletemodal] = useState(false);
  const [showClinicianModal, setShowClinicianModal] = useState(false);

  // ─── Step 1: passedSubmissions থেকে activeSubmission set ───
  useEffect(() => {
    if (!passedSubmissions.length) return;
    setActiveSubmission(passedSubmissions[0]);
  }, []);

  // ─── Step 2: answers fetch + passedSubmissions দিয়ে index-based group ───
  useEffect(() => {
    if (!selectedSubmission) return;

    const patientId =
      selectedSubmission.patient?.id || selectedSubmission.patientId;
    const assessmentId = selectedSubmission.assessmentId;

    if (!patientId || !assessmentId) return;

    const fetchAnswers = async () => {
      setIsLoading(true);
      try {
        const res = await getAllanswers({ patientId, assessmentId });
        const answersRaw = res?.payload || [];

        const grouped = {};
        passedSubmissions.forEach((sub, idx) => {
          const key = `${sub.questionType?.trim()}_${idx}`;
          const subAnswers = answersRaw.filter((item) => {
            const type =
              item.question?.questionType?.name ||
              item.question?.questionType ||
              item.questionType;
            return normalizeType(type) === normalizeType(sub.questionType);
          });
          grouped[key] = subAnswers;
        });

        setAnswers(grouped);
      } catch (err) {
        console.error("Error fetching answers:", err);
        setAnswers({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [selectedSubmission]);

  const handleAssignSuccess = async (newClinicianId) => {
    setSelectedSubmission((prev) => ({ ...prev, clinicianId: newClinicianId }));
    if (newClinicianId) {
      try {
        const clinicianRes = await getUserById(newClinicianId);
        setClinicianDetails(clinicianRes?.payload || null);
      } catch (err) {
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
        setAppointments(res?.payload || []);
      } catch (err) {
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

  const activeIndex = passedSubmissions.findIndex(
    (s) => s === activeSubmission,
  );
  const activeKey = `${activeSubmission?.questionType?.trim()}_${activeIndex}`;
  const activeAnswers = answers[activeKey] || [];

  // external check from answers 
  const isActiveTypeExternal =
    activeAnswers.some((ans) => ans.question?.variant === "external") &&
    !!(activeSubmission?.reviewer_name || activeSubmission?.reviewer_email);

  const reviewerInfo =
    isActiveTypeExternal && activeSubmission
      ? {
          name: activeSubmission.reviewer_name || null,
          email: activeSubmission.reviewer_email || null,
          occupation: activeSubmission.reviewer_occupation || null,
          relation: activeSubmission.reviewer_relation || null,
        }
      : null;

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
          className="absolute top-6 right-4 px-3 py-2 text-xs text-red-600 bg-red-200/80 rounded-full hover:bg-red-200"
        >
          Delete
        </button>
      </div>

      <div className="relative flex gap-2 flex-wrap mt-2">
        {passedSubmissions.map((sub, idx) => {
          const type = sub.questionType?.trim();
          const key = `${type}_${idx}`;

          // external tag — reviewer info from submission 
          const isExternalType = !!(sub.reviewer_name || sub.reviewer_email);

          return (
            <button
              key={key}
              onClick={() => setActiveSubmission(sub)}
              className={`px-4 py-2 rounded-full text-xs font-medium ${
                activeSubmission === sub
                  ? "bg-[#114654] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {type}
              {isExternalType && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold ml-2">
                  External
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Reviewer Info ── */}
      {reviewerInfo && (
        <div className="p-3 border rounded-md bg-amber-50 text-xs space-y-1 mb-3">
          <p>
            <span className="font-semibold">Reviewer Name </span>
            {reviewerInfo.name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Email </span>
            {reviewerInfo.email || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Occupation </span>
            {reviewerInfo.occupation || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Relation </span>
            {reviewerInfo.relation || "N/A"}
          </p>
        </div>
      )}

      <div className="relative text-sm border rounded-lg p-3">
        {/* ── Questions & Answers ── */}
        <div className="mt-4 space-y-4 text-xs">
          {activeAnswers.length > 0 ? (
            activeAnswers.map((ans, i) => {
              const isExternal = ans.question?.variant === "external";

              if (isExternal) {
                return (
                  <div
                    key={i}
                    className="p-3 border rounded-md bg-blue-50 space-y-1"
                  >
                    <p className="font-medium text-gray-800">
                      Q: {ans.question?.questions}
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
                    <p className="font-medium text-gray-800">
                      {ans.question?.questions}
                    </p>
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

        {/* ── AI Summary ── */}
        <div>
          <h2 className="mt-6 font-semibold mb-3 text-lg">AI Summary</h2>
          {activeSubmission && (
            <div>
              <p className="text-sm font-semibold text-[#4B4B4B] mb-1">
                {activeSubmission.questionType}
              </p>
              <p className="text-xs text-gray-500 text-justify whitespace-pre-line">
                {activeSubmission.summary
                  ?.replace(/[*#_`>]+/g, "")
                  ?.replace(/-{3,}/g, "")
                  ?.trim() || "No summary available for this section."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Clinician Details ── */}
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

      {/* ── Clinician Assignment Modal ── */}
      <ManuallyClinicianAssign
        show={showClinicianModal}
        onClose={() => setShowClinicianModal(false)}
        submissionIds={passedSubmissions.map((s) => s.id)}
        onSuccess={handleAssignSuccess}
      />

      {/* ── Appointments ── */}
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