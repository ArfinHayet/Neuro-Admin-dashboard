import React, { useEffect, useState } from "react";
import logo from "../../../public/png/NeuroChPro_20250926_191549_0000.png";
import { useSearchParams } from "react-router-dom";
import { token } from "../../Components/utils/token";
import { domain } from "../../../credential";
import { getUserById } from "../../api/user";
import { getPatientsByUserId } from "../../api/patient";
import { createSubmission, updateSubmission } from "../../api/submissions";
import { getAssessmentById } from "../../api/assessments";
import { getAllQuestionCategories } from "../../api/questioncategories";
import toast from "react-hot-toast";
import { RxCrossCircled } from "react-icons/rx";


const ExternalUserSubmissionPage = () => {
  const [params] = useSearchParams();

  // dynamic params from URL
  const assessmentId = Number(params.get("assessmentId"));
  const questiontypeid = Number(params.get("questiontypeid"));
  const userId = Number(params.get("userId") );
  const patientId = Number(params.get("patientId"));
  
  const reviewer_name = params.get("reviewer_name") || "";
  const reviewer_email = params.get("reviewer_email") || "";


  const [reviewer_occupation, setReviewerOccupation] = useState("");
  const [reviewer_relation, setReviewerRelation] = useState("");

  const [questions, setQuestions] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [questionType, setQuestionType] = useState(null);

  const [assessmentInfo, setAssessmentInfo] = useState(null);
  const [questionCategories, setQuestionCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submit, setSubmit] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingAssessment, setLoadingAssessment] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);



useEffect(() => {
  const allParams = Object.fromEntries(params.entries());
  console.log("URL params object:", allParams);
}, [params]);

  
  
  // Fetch assessment details (category, description)
 const fetchAssessment = async () => {
   try {
     setLoadingAssessment(true);
     const res = await getAssessmentById(assessmentId);
     console.log("assessment payload:", res);
     setAssessment(res);
   } catch (err) {
     console.error("Failed to fetch assessment info", err);
   } finally {
     setLoadingAssessment(false);
   }
 };


  // Fetch all question categories
  const fetchQuestionCategories = async () => {
    try {
      const res = await getAllQuestionCategories(); // make sure it's a function call
      if (res?.payload) setQuestionCategories(res.payload);
    } catch (err) {
      console.error("Failed to fetch question categories", err);
    }
  };

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

  useEffect(() => {
    if (assessmentId) fetchAssessment();
    fetchQuestionCategories();

    if (assessmentId && questiontypeid) {
      fetchQuestions();
    }

    if (userId && patientId) {
      fetchUser();
      fetchPatient();
    }
  }, [assessmentId, questiontypeid, userId, patientId]);

  if (!assessmentId || !questiontypeid || !userId || !patientId) {
    return <div>Invalid or expired link</div>;
  }




  const handleAnswerChange = (questionId, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answer: value } : q))
    );

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });

    console.log("Answered:", value);
  };

  const handleSubmit = async () => {
    try {

      if (
        !reviewer_name ||
        !reviewer_email ||
        !reviewer_occupation ||
        !reviewer_relation
      ) {
        toast.error("All reviewer fields are required");
        return;
      }

      const newErrors = {};
      questions.forEach((q) => {
        if (!q.answer || q.answer.trim() === "") {
          newErrors[q.id] = true;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error("Please answer all questions", {
          icon: <RxCrossCircled />,
        });
        return;
      }

      setErrors({});
      const createPayload = {
        patientId,
        assessmentId,
        userId,
        questionType: "ASRS",
        answers: questions.map((q) => ({
          questionId: q.id,
          userId,
          patientId,
          assessmentId,
          answer: q.answer,
        })),
      };

      const createRes = await createSubmission(createPayload);
      if (!createRes?.payload?.id)
        throw new Error("Submission creation failed");
      const submissionId = createRes.payload.id;

      // Update reviewer info
      const updatePayload = {
        reviewer_name: reviewer_name,
        reviewer_email: reviewer_email,
        reviewer_occupation: reviewer_occupation,
        reviewer_relation: reviewer_relation,
      };
      await updateSubmission(submissionId, updatePayload);

      toast.success("Submission successful!");
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Submission failed", { icon: <RxCrossCircled /> });
    }
  };

  if (loading) {
    return (
      <section className="h-[90vh] flex flex-col justify-center items-center">
        <div className="custom-loader"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading assessments details ...
        </p>
      </section>
    );
  }

  return (
    <section className="bg-[#114654] h-screen flex flex-col">
      {/* Sticky header */}
      <div className="bg-white flex justify-between items-center py-3 px-6 shadow-md sticky top-0 z-10">
        <img src={logo} alt="Logo" className="w-[220px]" />
        <h2 className="font-semibold text-xl">
          {assessment?.category || assessment?.name || "Assessment Name"} /{" "}
          {questionCategories.find((cat) => cat.id === questiontypeid)?.name ||
            "Question Type"}
        </h2>

        <button
          onClick={handleSubmit}
          className="bg-[#114654] px-4 py-2 text-white rounded-md text-sm mr-2"
        >
          Submit
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 py-4">
        {/* Intro Section */}
        <div className="bg-white w-[80vw] mx-auto p-6 rounded-md text-center">
          <h2 className="font-semibold text-xl">
            {assessment?.category || assessment?.name || "Assessment Name"} /{" "}
            {questionCategories.find((cat) => cat.id === questiontypeid)
              ?.name || "Question Type"}
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            {assessment?.description || "No description available."}
          </p>

          <p className="text-red-500 text-xs ">
            * All fields are required here
          </p>
        </div>
        <div className="bg-white w-[80vw] mx-auto p-6 rounded-md space-y-1 ">
          <p className="p-2 border rounded-md text-sm">
            User Name {user?.name || "Loading..."}
          </p>
          <h2 className="p-2  rounded-md font-semibold">Patient Details</h2>

          <p className="p-2 border rounded-md text-sm">
            Patient Name {patient?.name || "Loading..."}
          </p>
          <p className="p-2 border rounded-md text-sm">
            Date of Birth {patient?.dateOfBirth || "Loading..."}
          </p>
          <p className="p-2 border rounded-md text-sm">
            Gender {patient?.gender || "Loading..."}
          </p>
        </div>

        {/* reviewer inputs */}

        <div className="bg-white w-[80vw] mx-auto p-6 rounded-md ">
          <strong>Reviewer Details </strong>
          <p className=" "> Name {reviewer_name || "N/A"}</p>

          <p className=" "> Email {reviewer_email || "N/A"}</p>
        </div>
        <div className="bg-white w-[80vw] mx-auto p-6 rounded-md mt-4">
          <div className="mt-2 flex flex-col gap-2">
            <label className="" htmlFor="">
              Your Occupation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Write Your Occupation"
              value={reviewer_occupation}
              onChange={(e) => setReviewerOccupation(e.target.value)}
              className="w-1/2 border-b rounded px-3 py-2 text-sm"
            />

            <label className="mt-4" htmlFor="">
              Your Relation to Patient <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Write Your Relation with Patient"
              value={reviewer_relation}
              onChange={(e) => setReviewerRelation(e.target.value)}
              className="w-1/2 border-b rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className={`bg-white w-[95vw] lg:w-[80vw] mx-auto p-4 lg:p-8 rounded-md shadow-sm
             ${errors[q.id] ? "border-2 border-red-500" : ""}
             `}
          >
            <p className=" text-gray-800 mb-3 lg:mb-4">
              {index + 1}. {q.questions} <span className="text-red-500">*</span>
            </p>

            {q.answerType === "Yes/No" && "MultipleChoice" && (
              <div className="flex flex-col gap-4 ml-4">
                {q.options.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 cursor-pointer text-sm"
                  >
                    {errors[q.id] && (
                      <p className="text-red-500 text-xs mt-2">
                        This question is required
                      </p>
                    )}
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      className="w-4 h-4 accent-[#114654]"
                      checked={q.answer === option}
                      onChange={() => handleAnswerChange(q.id, option)}
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
                value={q.answer || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExternalUserSubmissionPage;
