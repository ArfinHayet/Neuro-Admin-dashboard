import { useState } from "react";

const QuestionModal = ({ isOpen, onClose, onSave, defaultType = "initial" }) => {
  const [formData, setFormData] = useState({
    assessmentName: "",
    type: defaultType,
    question: "",
    answerType: "yesno",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.assessmentName.trim() || !formData.question.trim()) return;
    onSave(formData);
    setFormData({
      assessmentName: "",
      type: defaultType,
      question: "",
      answerType: "yesno",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[30vw]">
        <h2 className="text-center font-medium mb-6">Add New Assessment Question</h2>

        {/* Assessment Name */}
        <label className="block text-sm  mb-1">Assessment Name</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-3"
          value={formData.assessmentName}
          onChange={(e) => handleChange("assessmentName", e.target.value)}
        />

        {/* Type */}
        <label className="block text-sm  mb-1">Type</label>
        <select
          className="w-full border px-3 py-2 rounded mb-3"
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="initial">Initial Assessment</option>
          <option value="ondemand">On-Demand Assessment</option>
        </select>

        {/* Question */}
        <label className="block text-sm  mb-1">Question</label>
        <textarea
          className="w-full border px-3 py-2 rounded mb-3"
          rows={3}
          value={formData.question}
          onChange={(e) => handleChange("question", e.target.value)}
        />

        {/* Answer Type */}
        <label className="block text-sm mb-1">Answer Type</label>
        <select
          className="w-full border px-3 py-2 rounded mb-4"
          value={formData.answerType}
          onChange={(e) => handleChange("answerType", e.target.value)}
        >
          <option value="yesno">Yes / No</option>
          <option value="multiple">Multiple Choice</option>
          <option value="text">Text</option>
        </select>

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

export default QuestionModal;
