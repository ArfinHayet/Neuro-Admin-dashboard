import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const InitialModal = ({ isOpen, onClose, onSave, defaultType = "initial" }) => {
  const [formData, setFormData] = useState({
    type: defaultType,
    question: "",
    answerType: "yesno",
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
        const numericVal = Number(value);
        updatedAnswers[index][key] = numericVal === 1 ? 1 : 0;
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
        <h2 className="text-center font-medium mb-6">
          Add New Assessment Question
        </h2>
        {/* Assessment Type */}
        <label className="block text-xs mb-1">Assessment Type</label>
        <div className="w-full border px-3 py-2 rounded mb-3 text-sm">
          <p>Initial Assessment</p>
        </div>
        {/* Question */}
        <label className="block text-xs mb-1">Question</label>
        <textarea
          className="w-full border px-2 py-1 rounded mb-4"
          rows={2}
          value={formData.question}
          onChange={(e) => handleChange("question", e.target.value)}
        />
        <label className="block text-xs mb-1">Question Order</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4 text-sm"
          value={formData.questionOrder}
          onChange={(e) => handleChange("questionOrder", e.target.value)}
          placeholder="Enter question order number"
        />

        {/* Answer */}
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

        {/*  when multiple option choose*/}
        {formData.answerType === "multiple" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs ">Answer Options</label>
              <button
                type="button"
                onClick={addAnswerOption}
                className="text-xs bg-primary bg-opacity-85 px-2 py-1 rounded-full text-white"
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
                    onChange={(e) =>
                      handleAnswerChange(i, "label", e.target.value)
                    }
                    placeholder={`Option ${i + 1} `}
                  />
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={1}
                    className="w-28 border px-2 py-1 rounded text-center"
                    value={answer.score}
                    onChange={(e) =>
                      handleAnswerChange(i, "score", e.target.value)
                    }
                    title="Score (0 or 1)"
                    placeholder={`Score(0 or 1)`}
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
        <div className="flex justify-between gap-3">
          <button
            className="px-4 py-2 rounded-full bg-gray-200"
            onClick={onClose}
          >
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

export default InitialModal;
