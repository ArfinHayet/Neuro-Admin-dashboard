import { useEffect, useState } from "react";
import { addQuestion, updateQuestion } from "../../api/questionnaires";
//import { onDemandAssessments } from "../utils/Data";
import { useParams } from "react-router-dom";

const OnDemandQuestionModal = ({
  isOpen,
  onClose,
  onSave,
  defaultType = "ondemand",
  editingQuestion,
  assessment,
}) => {
  const [formData, setFormData] = useState({
    type: defaultType,
    questions: "",
    questionOrder: "",
    answerType: "Yes/No",
    options: ["Yes", "No"],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  //const { id } = useParams();
  // const assessment = onDemandAssessments.find(
  //   (item) => item.id.toString() === id
  // );

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        type: defaultType,
        questions: editingQuestion.questions || "",
        questionOrder: editingQuestion.order || "",
        answerType: editingQuestion.answerType || "Yes/No",
        options: editingQuestion.options || ["Yes", "No"],
      });
    } else {
      setFormData({
        type: defaultType,
        questions: "",
        questionOrder: "",
        answerType: "Yes/No",
        options: ["Yes", "No"],
      });
    }
  }, [editingQuestion, defaultType]);

  const handleChange = (field, value) => {
    if (field === "questionOrder") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    } else if (field === "answerType") {
      let options = [];
      if (value === "Yes/No") {
        options = ["Yes", "No"];
      } else if (value === "Text") {
        options = ["Text"];
      } else if (value === "MultipleChoice") {
        options = [{ label: "", score: "" }];
      }
      setFormData((prev) => ({ ...prev, answerType: value, options }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    if (formData.answerType === "MultipleChoice") {
      updated[index].label = value;
    } else {
      updated[index] = value;
    }
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { label: "" }],
    }));
  };

 const removeOption = (index) => {
    const updated = formData.options.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      options: updated.length ? updated : [{ label: "" }],
    }));
  };

  const validateForm = () => {
    if (!formData.questions.trim()) {
      setError("Question(s) is required");
      return false;
    }
    if (!formData.questionOrder) {
      setError("Question order is required");
      return false;
    }
    if (
      formData.answerType === "MultipleChoice" &&
      formData.options.some((o) => !o.label.trim())
    ) {
      setError("All options must have labels");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!assessment) {
      setError("No assessment selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        assessmentId: assessment.id,
        questions: formData.questions,
        order: Number(formData.questionOrder),
        answerType: formData.answerType,
        options:
          formData.answerType === "MultipleChoice"
            ? formData.options.map((o) => o.label)
            : formData.options,
      };

      const savedQuestion = editingQuestion
        ? await updateQuestion(editingQuestion.id, payload)
        : await addQuestion(payload);

      onSave(savedQuestion);
      onClose();
    } catch (err) {
      console.error("Failed to save question", err);
      setError(err.message || "Failed to save question");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modalWrapper") onClose();
  };

  return (
    <div
      id="modalWrapper"
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white rounded-lg p-6 w-[30vw] max-w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center font-medium mb-6">
          {editingQuestion
            ? "Edit On-Demand Question"
            : "Add On-Demand Assessment Question"}
        </h2>

        {/* Assessment Name (Fixed) */}
        {/* <label className="block text-xs mb-1">Assessment Name</label>
        <p className="w-full border px-3 py-2 rounded mb-3 text-xs">
          {assessment?.category || ""}
        </p> */}

        {/* Assessment Type */}
        <label className="block text-xs mb-3 font-medium text-gray-700">
          Assessment Type
        </label>
        <div className="w-full border px-3 py-2 rounded mb-4 text-xs text-gray-600">
          <p>On-Demand Assessment</p>
        </div>

        {/* Question */}
        <label className="block text-xs mb-1">Question</label>
        <textarea
          className="w-full border px-3 py-2 rounded mb-3 text-xs"
          rows={2}
          value={formData.questions}
          onChange={(e) => handleChange("questions", e.target.value)}
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
          className="w-full border px-3 py-2 rounded mb-3 text-xs"
          value={formData.answerType}
          onChange={(e) => handleChange("answerType", e.target.value)}
        >
          <option value="Yes/No">Yes / No</option>
          <option value="MultipleChoice">Multiple Choice</option>
          <option value="Text">Text</option>
        </select>

        {formData.answerType === "MultipleChoice" && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium">Options</label>
              <button
                type="button"
                onClick={addOption}
                className="text-xs bg-primary px-2 py-1 rounded-full text-white"
              >
                Add Option
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {formData.options.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="flex-1 border px-2 py-1 rounded"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                  />
                  {formData.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-red-500 font-bold px-2"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        <div className="flex justify-between gap-3">
          <button
            className="px-4 py-2 rounded-full bg-gray-200"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-full bg-[#114654] text-white"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnDemandQuestionModal;
