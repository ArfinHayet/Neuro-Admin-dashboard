import React from "react";
import logo from "../../../public/png/NeuroChPro_20250926_191549_0000.png";

const ExternalUserSubmissionPage = () => {
  // Dummy questions (you’ll fetch them from API later)
  const questions = [
    {
      id: 1,
      question:
        "How often does the child have difficulty organizing tasks and activities?",
      answerType: "MultipleChoice",
      options: ["Never", "Sometimes", "Often", "Very Often"],
    },
    {
      id: 2,
      question:
        "How often does the child fail to give close attention to details or make careless mistakes?",
      answerType: "MultipleChoice",
      options: ["Never", "Sometimes", "Often", "Very Often"],
    },
    {
      id: 3,
      question:
        "Please describe any challenges the child faces in focusing during class.",
      answerType: "Text",
      options: [],
    },
  ];

  return (
    <section className="bg-[#114654] h-screen flex flex-col">
      {/* Sticky header */}
      <div className="bg-white flex justify-between items-center py-3 px-6 shadow-md sticky top-0 z-10">
        <img src={logo} alt="Logo" className="w-[200px]" />
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

          <p className="text-sm ">Patient Name</p>
          <p className="text-sm ">patient age</p>


        </div>

        {/* Questions Section */}
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white w-[80vw] mx-auto p-6 rounded-md shadow-sm"
          >
            <p className="font-medium text-gray-800 mb-4">
              {q.id}. {q.question}
            </p>

            {/* Multiple choice */}
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

            {/* Text input */}
            {q.answerType === "Text" && (
              <textarea
                placeholder="Type your answer here..."
                className="w-2/3 border-b  px-3 py-2 text-sm text-gray-700 mt-2 focus:outline-none "
                rows={1}
              ></textarea>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExternalUserSubmissionPage;
