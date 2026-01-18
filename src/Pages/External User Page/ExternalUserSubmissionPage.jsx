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

  const parseNumberParam = (value) => {
    if (!value) return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  };

  const assessmentId = parseNumberParam(params.get("assessmentId"));
  const questiontypeid = parseNumberParam(params.get("questiontypeid"));
  const userId = parseNumberParam(params.get("userId"));
  const patientId = parseNumberParam(params.get("patientId"));
  const reviewer_name = params.get("reviewer_name") || "";
  const reviewer_email = params.get("reviewer_email") || "";

  const [reviewer_occupation, setReviewerOccupation] = useState("");
  const [reviewer_relation, setReviewerRelation] = useState("");

  const [questions, setQuestions] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [questionCategories, setQuestionCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 15;

  useEffect(() => {
    const allParams = Object.fromEntries(params.entries());
    console.log("URL params object:", allParams);
  }, [params]);

  const fetchAssessment = async () => {
    try {
      const res = await getAssessmentById(assessmentId);
      console.log("assessment payload:", res);
      setAssessment(res);
    } catch (err) {
      console.error("Failed to fetch assessment info", err);
    }
  };

  const fetchQuestionCategories = async () => {
    try {
      const res = await getAllQuestionCategories();
      if (res?.payload) setQuestionCategories(res.payload);
    } catch (err) {
      console.error("Failed to fetch question categories", err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${domain}/questionnaires?assessmentId=${assessmentId}&questiontypeid=${questiontypeid}&page=1&limit=1000`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
        },
      );

      const data = await res.json();

      if (Array.isArray(data?.payload)) {
        setQuestions(data.payload);
      } else if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      assessmentId === null ||
      questiontypeid === null ||
      userId === null ||
      patientId === null ||
      !reviewer_name ||
      !reviewer_email
    ) {
      setLoading(false);
      return;
    }

    if (assessmentId) fetchAssessment();
    fetchQuestionCategories();

    if (assessmentId && questiontypeid) {
      fetchQuestions();
    }
  }, [assessmentId, questiontypeid, userId, patientId]);

  if (
    assessmentId === null ||
    questiontypeid === null ||
    userId === null ||
    patientId === null ||
    !reviewer_name ||
    !reviewer_email
  ) {
    return (
      <section className="h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Invalid or Expired Link
          </h2>
          <p className="text-gray-600">
            This submission link is invalid or has expired. Please contact the
            person who sent you this link.
          </p>
        </div>
      </section>
    );
  }

  const handleAnswerChange = (questionId, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answer: value } : q)),
    );

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  // Check if current page questions are all answered
  const isCurrentPageComplete = currentQuestions.every(
    (q) => q.answer && q.answer.trim() !== "",
  );

  // Check if all questions are answered
  const isAllQuestionsAnswered = questions.every(
    (q) => q.answer && q.answer.trim() !== "",
  );

  // Check if reviewer details are filled
  const isReviewerDetailsComplete =
    reviewer_occupation.trim() !== "" && reviewer_relation.trim() !== "";

  // Can submit only on last page with all questions answered
  const canSubmit =
    currentPage === totalPages &&
    isAllQuestionsAnswered &&
    isReviewerDetailsComplete;

  const handleNext = () => {
    if (!isCurrentPageComplete) {
      const newErrors = {};
      currentQuestions.forEach((q) => {
        if (!q.answer || q.answer.trim() === "") {
          newErrors[q.id] = true;
        }
      });
      setErrors(newErrors);
      toast.error("Please answer all questions on this page", {
        icon: <RxCrossCircled />,
      });
      return;
    }

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      if (!reviewer_occupation || !reviewer_relation) {
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
      console.log("Create submission response:", createRes);

      // Check different response structures
      const submissionId =
        createRes?.payload?.id || createRes?.id || createRes?.data?.id;

      if (!submissionId) {
        console.error("Full response:", createRes);
        throw new Error("Submission creation failed - no ID returned");
      }

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
    <section className="bg-[#114654] min-h-screen flex flex-col">
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
          disabled={!canSubmit}
          className={`px-4 py-2 text-white rounded-md text-sm mr-2 transition ${
            canSubmit
              ? "bg-[#114654] hover:bg-[#0d3640] cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 py-4">
        {/* Show reviewer details */}
        {currentPage === 1 && (
          <>
            {/* Intro Section */}
            <div className="bg-white w-[80vw] mx-auto p-6 rounded-md text-center">
              <h2 className="font-semibold text-xl">
                {assessment?.category || assessment?.name || "Assessment Name"}{" "}
                /{" "}
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

            {/* Reviewer Details */}
            <div className="bg-white w-[80vw] mx-auto p-6 rounded-md ">
              <strong>Reviewer Details </strong>
              <div className="pt-2 pb-5 flex flex-col w-3/5">
                {" "}
                <span className="text-xs "> Name </span>
                <span className="p-2 rounded-md border text-sm ">
                  {reviewer_name || "N/A"}
                </span>
              </div>

              <div className="flex flex-col w-3/5 ">
                {" "}
                <span className="text-xs">Email</span>{" "}
                <span className="p-2 border rounded-md text-sm ">
                  {reviewer_email || "N/A"}
                </span>{" "}
              </div>
            </div>

            {/* Reviewer Inputs */}
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
                  className="w-3/5 border-b  px-3 py-2 text-sm"
                />

                <label className="mt-2" htmlFor="">
                  Your Relation to Patient{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Write Your Relation with Patient"
                  value={reviewer_relation}
                  onChange={(e) => setReviewerRelation(e.target.value)}
                  className="w-3/5 border-b  px-3 py-2 text-sm"
                />
              </div>
            </div>
          </>
        )}

        {/* Page indicator */}
        <div className="bg-white w-[80vw] mx-auto p-4 rounded-md text-center">
          <p className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages} | Questions {startIndex + 1} -{" "}
            {Math.min(endIndex, questions.length)} of {questions.length}
          </p>
        </div>

        {/* Questions */}
        {currentQuestions.map((q, index) => (
          <div
            key={q.id}
            className={`bg-white w-[95vw] lg:w-[80vw] mx-auto p-4 lg:p-8 rounded-md shadow-sm ${
              errors[q.id] ? "border-2 border-red-500" : ""
            }`}
          >
            <p className=" text-gray-800 mb-3 lg:mb-4">
              {startIndex + index + 1}. {q.questions}{" "}
              <span className="text-red-500">*</span>
            </p>

            {(q.answerType === "Yes/No" ||
              q.answerType === "MultipleChoice") && (
              <div className="flex flex-col gap-4 ml-4">
                {q.options?.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 cursor-pointer text-sm"
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option.label}
                      className="w-4 h-4 accent-[#114654]"
                      checked={q.answer === option.label}
                      onChange={() => handleAnswerChange(q.id, option.label)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {q.answerType === "Text" && (
              <textarea
                placeholder="Type your answer here..."
                className="w-full border rounded px-3 py-2 text-sm text-gray-700 mt-2 focus:outline-none"
                rows={3}
                value={q.answer || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
            )}

            {errors[q.id] && (
              <p className="text-red-500 text-xs mt-2">
                This question is required
              </p>
            )}
          </div>
        ))}

        {/* Pagination buttons */}
        <div className="bg-white w-[80vw] mx-auto p-6 rounded-md flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-6 py-2 rounded-md text-sm font-medium transition ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#114654] text-white hover:bg-[#0d3640] cursor-pointer"
            }`}
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-700">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 rounded-md text-sm font-medium transition ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#114654] text-white hover:bg-[#0d3640] cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};;

export default ExternalUserSubmissionPage;
