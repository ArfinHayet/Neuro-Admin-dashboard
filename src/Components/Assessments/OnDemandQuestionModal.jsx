import { useState } from "react";

const OnDemandQuestionModal = ({ isOpen, onClose, onSave, defaultType = "ondemand" }) => {
  const [formData, setFormData] = useState({
    assessmentName: "",
    type: defaultType,
    question: "",
    questionOrder: "",
    answerType: "yesno", // added answerType
    answers: [{ label: "", score: "" }],
  });

  const handleChange = (field, value) => {
    if (field === "questionOrder") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAnswerChange = (index, key, value) => {
    setFormData((prev) => {
      const updatedAnswers = [...prev.answers];
      if (key === "score") {
        let val = value;
        if (val !== "0" && val !== "1" && val !== "") {
          val = "";
        }
        updatedAnswers[index][key] = val;
      } else {
        updatedAnswers[index][key] = value;
      }
      return { ...prev, answers: updatedAnswers };
    });
  };

  const addAnswerOption = () => {
    setFormData((prev) => ({
      ...prev,
      answers: [...prev.answers, { label: "", score: "" }],
    }));
  };

  const removeAnswerOption = (index) => {
    setFormData((prev) => {
      const updatedAnswers = prev.answers.filter((_, i) => i !== index);
      return {
        ...prev,
        answers: updatedAnswers.length
          ? updatedAnswers
          : [{ label: "", score: "" }],
      };
    });
  };

  const handleSave = () => {
    if (!formData.assessmentName.trim()) return;
    if (!formData.question.trim()) return;
    if (formData.questionOrder === "") return;
    if (
      formData.answerType === "multiple" &&
      formData.answers.some((a) => !a.label.trim())
    )
      return;

    onSave({
      ...formData,
      questionOrder: Number(formData.questionOrder),
    });

    setFormData({
      assessmentName: "",
      type: defaultType,
      question: "",
      questionOrder: "",
      answerType: "yesno",
      answers: [{ label: "", score: "" }],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[30vw] max-w-full max-h-[90vh] overflow-auto">
        <h2 className="text-center font-medium mb-6">Add On-Demand Assessment Question</h2>

        {/* Assessment Name */}
        <label className="block text-xs mb-1">Assessment Name</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-3 text-sm"
          value={formData.assessmentName}
          onChange={(e) => handleChange("assessmentName", e.target.value)}
          placeholder="Enter assessment name"
        />

        {/* Assessment Type (Static) */}
        <label className="block text-xs mb-3 font-medium text-gray-700">
          Assessment Type
        </label>
        <div className="w-full border px-3 py-2 rounded mb-4 text-sm text-gray-600 ">
         <p>On-Demand Assessment</p> 
        </div>

        {/* Question */}
        <label className="block text-xs mb-1">Question</label>
        <textarea
          className="w-full border px-3 py-2 rounded mb-3 text-sm"
          rows={2}
          value={formData.question}
          onChange={(e) => handleChange("question", e.target.value)}
        />

        {/* Question Order */}
        <label className="block text-xs mb-1">Question Order</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4 text-xs"
          value={formData.questionOrder}
          onChange={(e) => handleChange("questionOrder", e.target.value)}
          placeholder="Enter question order (number)"
        />

        {/* Answer Type */}
        <label className="block text-xs mb-1">Answer Type</label>
        <select
          className="w-full border px-3 py-2 rounded mb-4 text-xs"
          value={formData.answerType}
          onChange={(e) => handleChange("answerType", e.target.value)}
        >
          <option value="yesno">Yes / No</option>
          <option value="multiple">Multiple Choice</option>
          <option value="text">Text</option>
        </select>

        {/* Answer Options (only if multiple) */}
        {formData.answerType === "multiple" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs">Answer Options</label>
              <button
                type="button"
                onClick={addAnswerOption}
                className="text-xs bg-primary px-2 py-1 rounded-full text-white"
              >
                Add Option
              </button>
            </div>
            <div className="space-y-3 mb-6 text-xs">
              {formData.answers.map((answer, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    value={answer.label}
                    onChange={(e) => handleAnswerChange(i, "label", e.target.value)}
                    placeholder={`Option ${i + 1}`}
                  />
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={1}
                    className="w-28 border px-1 py-1 rounded text-center"
                    value={answer.score}
                    onChange={(e) => handleAnswerChange(i, "score", e.target.value)}
                    placeholder="Score (0 or 1)"
                  />
                  {formData.answers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAnswerOption(i)}
                      className="text-red-500 font-bold px-2"
                      title="Remove option"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-3">
          <button className="px-4 py-2 rounded-full bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-full bg-[#114654] text-white"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnDemandQuestionModal;
