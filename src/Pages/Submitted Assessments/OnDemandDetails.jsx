import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getAnswersByPatientAndAssessment } from "../../api/answers";
import { getAllAppointments } from "../../api/appointments";
import { getUserById } from "../../api/user";


const OnDemandDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const passedSubmissions = state?.submissions || []; // note: array of submissions
  const [selectedSubmission, setSelectedSubmission] = useState(
    passedSubmissions[0] || null
  );
  const [groupedAnswers, setGroupedAnswers] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allAnswers, setAllAnswers] = useState({});

  const [appointments, setAppointments] = useState([]);
  const [matchedAppointment, setMatchedAppointment] = useState(null);
  const [clinicianDetails, setClinicianDetails] = useState(null);



  useEffect(() => {
    const fetchAllAnswers = async () => {
      if (!passedSubmissions.length) return;

      const answersMap = {};

      await Promise.all(
        passedSubmissions.map(async (sub) => {
          try {
            const res = await getAnswersByPatientAndAssessment(
              sub.patient.id,
              sub.assessmentId,
              { limit: 100 }
            );
            const ans = res?.payload || [];

            const grouped = ans.reduce((acc, item) => {
              const type = sub.questionType || "Unknown";
              if (!acc[type]) acc[type] = [];
              acc[type].push(item);
              return acc;
            }, {});

            answersMap[sub.id] = grouped;
          } catch (err) {
            console.error("Error fetching answers for submission", sub.id, err);
            answersMap[sub.id] = {};
          }
        })
      );

      setAllAnswers(answersMap);
      setGroupedAnswers(answersMap[selectedSubmission.id] || {});
      setSelectedType(
        Object.keys(answersMap[selectedSubmission.id] || {})[0] || null
      );
      setIsLoading(false);
    };

    fetchAllAnswers();
  }, []);

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
        appt.patientId === selectedSubmission.patientId
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
      console.log(res)
      setClinicianDetails(res?.payload || null);
    } catch (err) {
      console.error("Error fetching clinician details:", err);
      setClinicianDetails(null);
    }
  };

  fetchClinician();
}, [selectedSubmission]);


  if (isLoading)
    return (
      <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
        <div className="flex justify-center items-center h-40">
          <p>Loading assessment details...</p>
        </div>
      </section>
    );

  if (!selectedSubmission) return <p>Submission not found.</p>;

  const questionTypes = Object.keys(groupedAnswers);

  return (
    <section className="space-y-2 pb-14">
      <h1 className="text-xl font-semibold ">
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
          {/* ( {selectedSubmission.clinicianId}) */}
        </p>

        <p>
          <span className="font-semibold">Status </span>
          {selectedSubmission.status}
        </p>
        {/* <p>
          <span className="font-semibold">Ratings: </span>
          {selectedSubmission.ratings}
        </p> */}
      </div>

      {/* Switch between multiple submissions if parent passes grouped */}
      {passedSubmissions.length > 1 && (
        <div className="mt-6 flex gap-2 flex-wrap">
          {passedSubmissions.map((sub, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedSubmission(sub);
                setGroupedAnswers(allAnswers[sub.id] || {});
                setSelectedType(
                  Object.keys(allAnswers[sub.id] || {})[0] || null
                );
              }}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                selectedSubmission.id === sub.id
                  ? "bg-[#114654] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {sub.questionType ||
                sub.assessment?.name ||
                `Submission ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Questions & answers for selected type */}
      {/* <div className="mt-4 space-y-4 text-xs">
        {selectedType && groupedAnswers[selectedType]?.length > 0 ? (
          groupedAnswers[selectedType].map((ans, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {ans.question?.questions || "No question text"}
                </p>
                <div className="flex gap-2 items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mt-1"></div>
                  <p className="text-secondary mt-1">
                    {ans.answer || "No answer"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 border border-gray-300 rounded-xl p-4 bg-white max-w-4xl">
            No answers submitted yet for this question type.
          </p>
        )}
      </div> */}

      {/* Summary */}
      <div className="py-4 bg-white rounded-md mt-6 max-w-4xl">
        <h2 className=" font-semibold mb-2 text-lg">AI Summary</h2>
        <p className="mt-1 text-gray-700 whitespace-pre-line text-sm">
          {selectedSubmission.summary
            ? selectedSubmission.summary.replace(/\*/g, "")
            : "No summary available."}
        </p>
      </div>


      {/* clinician details */}

      <div className="mt-4 text-sm border rounded-lg p-3 bg-white">
        <h2 className="font-semibold text-lg ">Clinician Details</h2>

        {clinicianDetails  && (
          <div className=" space-y-1 mt-2">
            <p>
              <span className="font-semibold">Clinician Name </span>{" "}
              {clinicianDetails.name}
            </p>
            <p>
              <span className="font-semibold">Email </span>{" "}
              {clinicianDetails.email}
            </p>
            <p>
              <span className="font-semibold">Phone </span>{" "}
              {clinicianDetails.phone}
            </p>
            {/* <p>
              <span className="font-semibold">ID </span> {clinicianDetails.id}
            </p> */}
          </div>
        )}
      </div>

      {/* appointments */}

      {matchedAppointment  && (
        <div className=" text-sm mt-6 border rounded-md p-3 ">
          <h2 className="font-semibold mb-1 text-lg">Scheduled Appointment</h2>
          <p>
            <span className="font-semibold">Date & Time  </span>
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
            {matchedAppointment.status} /{" "}
            {matchedAppointment.metting_status}
          </p>
        </div>
     )}
    </section>
  );
};

export default OnDemandDetails;
