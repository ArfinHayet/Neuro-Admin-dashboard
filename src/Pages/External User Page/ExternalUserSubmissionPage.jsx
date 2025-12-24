import React, { useEffect, useState } from "react";
import logo from "../../../public/png/NeuroChPro_20250926_191549_0000.png";
import { useSearchParams } from "react-router-dom";
import { token } from "../../Components/utils/token";
import { domain } from "../../../credential";
import { getUserById } from "../../api/user";
import { getPatientsByUserId } from "../../api/patient";



const ExternalUserSubmissionPage = () => {
  const [params] = useSearchParams();


  
  // dynamic params from URL
 const assessmentId = Number(params.get("assessmentId") ?? 2);
 const questiontypeid = Number(params.get("questiontypeid") ?? 64);
 const userId = Number(params.get("userId") ?? 4);
 const patientId = Number(params.get("patientId") ?? 2);
 const reviewerId = params.get("reviewerId")
   ? Number(params.get("reviewerId"))
   : null;

  const [questions, setQuestions] = useState([]);
  const [assessmentInfo, setAssessmentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${domain}/questionnaires?assessmentId=${assessmentId}&questiontypeid=${questiontypeid}`,

        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);

      if (Array.isArray(data)) {
        setQuestions(data);
      } else if (Array.isArray(data.payload)) {
        setQuestions(data.payload);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  };

  const [patient, setPatient] = useState(null);
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);


  // fetch patient info
const fetchPatient = async () => {
  try {
    const data = await getPatientsByUserId(userId);

    // console.log("PATIENT PAYLOAD:", data.payload);
    // console.log("URL patientId:", patientId);

    if (Array.isArray(data.payload)) {
      const selectedPatient = data.payload.find((p) => p.id === patientId);
      setPatient(selectedPatient || null);
      return;
    }

    if (data.payload && typeof data.payload === "object") {
      setPatient(data.payload);
      return;
    }

    setPatient(null);
  } catch (err) {
    console.error("Failed to fetch patient info", err);
    setPatient(null);
  }
};


  // fetch user info
  const fetchUser = async () => {
    try {
      const data = await getUserById(userId);
      if (data && data.payload) {
        setUser(data.payload);
      }
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

 useEffect(() => {
   if (assessmentId && questiontypeid) {
     fetchQuestions();
   }
 }, [assessmentId, questiontypeid]);

useEffect(() => {
  if (userId && patientId) {
    fetchUser();
    fetchPatient();
  }
}, [userId, patientId]);

  
if (!assessmentId || !questiontypeid || !userId || !patientId) {
  return <div>Invalid or expired link</div>;
  }
  
  return (
    <section className="bg-[#114654] h-screen flex flex-col">
      {/* Sticky header */}
      <div className="bg-white flex justify-between items-center py-3 px-6 shadow-md sticky top-0 z-10">
        <img src={logo} alt="Logo" className="w-[220px]" />
        <h2 className="font-semibold text-xl">ASRS Category Assessment</h2>
        <button className="bg-[#114654] px-4 py-2 text-white rounded-md text-sm mr-2">
          Submit
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 py-4">
        {/* Intro Section */}
        <div className="bg-white w-[80vw] mx-auto p-6 rounded-md text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            ASRS (Adult ADHD Self-Report Scale) / assessment Name
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            This section helps evaluate ADHD-related symptoms through simple,
            structured questions about focus, behavior, and activity levels.
          </p>
        </div>
        <div className="bg-white w-[80vw] mx-auto p-6 rounded-md space-y-1 ">
          <h2 className="font-semibold">Patient Details</h2>

          <p className="text-sm">
            Patient Name {patient?.name || "Loading..."}
          </p>
          <p className="text-sm">
            Date of Birth {" "}
            {patient?.dateOfBirth || "Loading..."} 
          </p>
          <p className="text-sm">Gender {patient?.gender || "Loading..."}</p>
          <h2 className="font-semibold">User Details</h2>

          <p className="text-sm">User Name {user?.name || "Loading..."}</p>
        </div>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white w-[95vw] lg:w-[80vw] mx-auto p-4 lg:p-6 rounded-md shadow-sm"
          >
            <p className="font-medium text-gray-800 mb-3 lg:mb-4">
              {index + 1}. {q.questions}
            </p>

            {q.answerType === "Yes/No" && "MultipleChoice" && (
              <div className="flex flex-col gap-3 ml-4">
                {q.options.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 cursor-pointer text-sm"
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      className="w-4 h-4 accent-[#114654]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {q.answerType === "Text" && (
              <textarea
                placeholder="Type your answer here..."
                className="w-2/3 border-b px-3 py-2 text-sm text-gray-700 mt-2 focus:outline-none"
                rows={1}
              />
            )}
          </div>
        ))}

        {/* Questions Section */}
        {/* {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white w-[80vw] mx-auto p-6 rounded-md shadow-sm"
          >
            <p className="font-medium text-gray-800 mb-4">
              {q.id}. {q.question}
            </p>

          //   Multiple choice 
            {q.answerType === "MultipleChoice" && (
              <div className="flex flex-col gap-3 ml-4">
                {q.options.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      className="w-4 h-4 accent-[#114654]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            // Text input 
            {q.answerType === "Text" && (
              <textarea
                placeholder="Type your answer here..."
                className="w-2/3 border-b  px-3 py-2 text-sm text-gray-700 mt-2 focus:outline-none "
                rows={1}
              ></textarea>
            )}
          </div>
        ))} */}
      </div>
    </section>
  );
};

export default ExternalUserSubmissionPage;
