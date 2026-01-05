import { useState } from "react";
import { IoMdAdd } from "react-icons/io";


const QuestionModal = ({
  isOpen,
  onClose,
  onSave,
  defaultType = "initial",
}) => {
  const [formData, setFormData] = useState({
    type: defaultType,
    question: "",
    answers: [{ label: "", score: 0 }], // start with one empty answer
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      answers: [...prev.answers, { label: "", score: 0 }],
    }));
  };

  const removeAnswerOption = (index) => {
    setFormData((prev) => {
      const updatedAnswers = prev.answers.filter((_, i) => i !== index);
      return {
        ...prev,
        answers: updatedAnswers.length
          ? updatedAnswers
          : [{ label: "", score: 0 }],
      };
    });
  };

  const handleSave = () => {
    if (!formData.question.trim()) return;
    // Validate answer labels not empty (optional)
    if (formData.answers.some((a) => !a.label.trim())) return;

    onSave(formData);

    setFormData({
      type: defaultType,
      question: "",
      answers: [{ label: "", score: 0 }],
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
        <select
          className="w-full border px-3 py-2 rounded mb-3 text-sm"
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="initial">Initial Assessment</option>
          <option value="ondemand">On-Demand Assessment</option>
        </select>
        {/* Question */}
        <label className="block text-xs mb-1">Question</label>
        <textarea
          className="w-full border px-3 py-2 rounded mb-4"
          rows={2}
          value={formData.question}
          onChange={(e) => handleChange("question", e.target.value)}
        />
        {/* Answer Options */}
     <div className="flex items-center justify-between mb-2">
        <label className="block text-xs ">Answer Options</label>
        <button
          type="button"
          onClick={addAnswerOption}
          className=" text-xs bg-primary px-2 py-1 rounded-full text-white"
        >
         add option
        </button></div> 
        <div className="space-y-3 mb-6 text-xs">
          {formData.answers.map((answer, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="text"
                className="flex-1 border px-2 py-1 rounded"
                value={answer.label}
                onChange={(e) => handleAnswerChange(i, "label", e.target.value)}
                placeholder={`Option ${i + 1} `}
              />
              <input
                type="number"
                min={0}
                max={1}
                step={1}
                className="w-12 border px-2 py-1 rounded text-center"
                value={answer.score}
                onChange={(e) => handleAnswerChange(i, "score", e.target.value)}
                title="Score (0 or 1)"
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
        {/* Actions */}
        <div className="flex justify-between gap-3">
          <button
            className=" py-2 font-semibold"
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

export default QuestionModal;
