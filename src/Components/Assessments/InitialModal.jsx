import { useEffect, useState } from "react";
import { addQuestion, updateQuestion } from "../../api/questionnaires";

const InitialModal = ({ isOpen, onClose, onSave, defaultType = "initial", editingQuestion,fetchQuestions }) => {
  const [formData, setFormData] = useState({
    type: defaultType,
    question: "",
    questionOrder: "",
    answerType: "yesno",
    answers: [{ label: "", score: "" }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        type: defaultType,
        question: editingQuestion.questions || "",
        questionOrder: editingQuestion.order || "",
        answerType: editingQuestion.answerType || "yesno",
        answers: editingQuestion.answers || [{ label: "", score: "" }],
      });
    } else {
      setFormData({
        type: defaultType,
        question: "",
        questionOrder: "",
        answerType: "yesno",
        answers: [{ label: "", score: "" }],
      });
    }
  }, [editingQuestion, defaultType]);

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
      formData.answerType === "multiple" &&
      formData.answers.some((a) => !a.label.trim())
    ) {
      setError("All answer options must have labels");
      return false;
    }
    if (
      formData.answerType === "multiple" &&
      formData.answers.some((a) => a.score === "")
    ) {
      setError("All answer options must have scores");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        assessmentId: 7, 
        questions: formData.question,
        order: Number(formData.questionOrder),
        answerType:
          formData.answerType === "yesno"
            ? "Yes/No"
            : formData.answerType === "multiple"
            ? "Multiple Choice"
            : "Text",
        answers: formData.answerType === "multiple" ? formData.answers : [],
      };

      const savedQuestion = editingQuestion
        ? await updateQuestion(editingQuestion.id, payload)
        : await addQuestion(payload);
      console.log("www",savedQuestion)
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
          className="w-full border px-3 py-2 rounded mb-4 text-sm"
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
          <option value="yesno">Yes / No</option>
          <option value="multiple">Multiple Choice</option>
          <option value="text">Text</option>
        </select>

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
                    placeholder={`Option ${i + 1}`}
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
                    placeholder="Score(0 or 1)"
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialModal;
