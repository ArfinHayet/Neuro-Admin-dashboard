import { useEffect, useState } from "react";
import { addQuestion, updateQuestion } from "../../api/questionnaires";
import { getAssessments } from "../../api/assessments";

const InitialModal = ({
  isOpen,
  onClose,
  onSave,
  defaultType = "initial",
  editingQuestion,
  fetchQuestions,
}) => {
  const [formData, setFormData] = useState({
    type: defaultType,
    question: "",
    questionOrder: "",
    answerType: "Yes/No",
    options: ["Yes", "No"],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);

  const fetchAssessment = async () => {
    try {
      const data = await getAssessments();
      console.log(data);

      if (!data?.payload) {
        console.error("No payload found");
        return;
      }

      const freeAssessment = data?.payload?.find((a) => a?.type === "free");
      console.log("Free Assessment Found", freeAssessment);
      setAssessment(freeAssessment);
    } catch (err) {
      console.error("Failed to fetch assessment", err);
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, []);

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        type: defaultType,
        question: editingQuestion.questions || "",
        questionOrder: editingQuestion.order || "",
        answerType: editingQuestion.answerType || "Yes/No",
        options: editingQuestion.options || ["Yes", "No"],
      });
    } else {
      setFormData({
        type: defaultType,
        question: "",
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
        options = ["Option A"];
      }

      setFormData((prev) => ({ ...prev, answerType: value, options }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAnswerChange = (index, key, value) => {
    if (formData.answerType !== "MultipleChoice") return;

    setFormData((prev) => {
      const updated = [...prev.options];
      updated[index][key] = value;
      return { ...prev, options: updated };
    });
  };

  const addAnswerOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, `Option ${prev.options.length + 1}`],
    }));
  };

  const removeAnswerOption = (index) => {
    setFormData((prev) => {
      const updated = prev.options.filter((_, i) => i !== index);
      return {
        ...prev,
        options: updated.length ? updated : ["Option A"],
      };
    });
  };

  const validateForm = () => {
    if (!formData.question.trim()) {
      setError("Question is required");
      return false;
    }
    if (!formData.questionOrder) {
      setError("Question order is required");
      return false;
    }
    if (
      formData.answerType === "MultipleChoice" &&
      formData.options.some((a) => !a.label.trim())
    ) {
      setError("All answer options must have labels");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!assessment) {
      setError("No free assessment found to attach this question.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        assessmentId: assessment.id,
        questions: formData.question,
        order: Number(formData.questionOrder),
        answerType: formData.answerType,
        options: formData.options,
      };

      console.log("payload", payload);

      const savedQuestion = editingQuestion
        ? await updateQuestion(editingQuestion.id, payload)
        : await addQuestion(payload);
      console.log("saved question", savedQuestion);

      onSave(savedQuestion);
      fetchQuestions();
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
          {editingQuestion ? "Edit Question" : "Add New Assessment Question"}
        </h2>

        <label className="block text-xs mb-1">Assessment Type</label>
        <div className="w-full border px-3 py-2 rounded mb-3 text-sm">
          {/*  <p>{assessment?.name || "Initial Assessment"}</p>*/}

          <p>Initial Assessment</p>
        </div>

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
          className="w-full border px-3 py-2 rounded mb-4 text-xs"
          value={formData.questionOrder}
          onChange={(e) => handleChange("questionOrder", e.target.value)}
          placeholder="Enter question order number"
        />

        <label className="block text-xs mb-1">Answer Type</label>
        <select
          className="w-full border px-3 py-2 rounded mb-4 text-xs"
          value={formData.answerType}
          onChange={(e) => handleChange("answerType", e.target.value)}
        >
          <option value="Yes/No">Yes / No</option>
          <option value="MultipleChoice">Multiple Choice</option>
          <option value="Text">Text</option>
        </select>

        {/* MultipleChoice Options */}
        {formData.answerType === "MultipleChoice" && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium">Answer Options</label>
              <button
                type="button"
                onClick={addAnswerOption}
                className="text-xs bg-primary bg-opacity-85 px-2 py-1 rounded-full text-white"
              >
                Add Option
              </button>
            </div>
            <div className="space-y-2 mb-6 text-xs">
              {formData.options?.map((option, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 border px-2 py-1 rounded"
                  />
                  {/* <input
                    type="number"
                    min={0}
                    max={1}
                    step={1}
                    value={option.score}
                    onChange={(e) =>
                      handleAnswerChange(i, "score", e.target.value)
                    }
                    className="w-28 border px-2 py-1 rounded text-center"
                    placeholder="Score(0 or 1)"
                  /> */}
                  {formData.options.length > 1 && (
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
          </div>
        )}

        <div className="flex justify-between gap-3 ">
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
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialModal;
