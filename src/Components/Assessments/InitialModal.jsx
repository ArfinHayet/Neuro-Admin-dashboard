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
  categoryId,
  categoryName,
}) => {
  const [formData, setFormData] = useState({
    type: defaultType,
    questions: "",
    order: "",
    answerType: "Yes/No",
    options: ["yes", "no"],
    questiontypeid: "",
    variant: "",
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
      let options = ["yes", "no"];

      if (Array.isArray(editingQuestion.options)) {
        options = editingQuestion.options;
      } else if (typeof editingQuestion.options === "string") {
        try {
          options = JSON.parse(editingQuestion.options);
        } catch {
          options = ["yes", "no"];
        }
      }

      setFormData({
        type: defaultType,
        questions: editingQuestion.questions || "",
        order: editingQuestion.order || "",
        answerType: editingQuestion.answerType || "",
        options: options,
        questiontypeid: editingQuestion.questiontypeid || "",
        variant: editingQuestion.variant || "",
      });
    } else {
      setFormData({
        type: defaultType,
        questions: "",
        order: "",
        answerType: "Yes/No",
        options: [""],
        questiontypeid: "",
        variant: "",
      });
    }
  }, [editingQuestion, defaultType]);


  const handleChange = (field, value) => {
    if (field === "order") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    } else if (field === "answerType") {
      let options = [];
      if (value === "Yes/No") {
        options = ["" ];
      } else if (value === "Text") {
        options = [""];
      } else if (value === "MultipleChoice") {
        options = [""];
      }

      setFormData((prev) => ({ ...prev, answerType: value, options }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

 const handleOptionChange = (index, value) => {
   if (
     formData.answerType !== "MultipleChoice" &&
     formData.answerType !== "Yes/No"
   )
     return;
   setFormData((prev) => {
     const updated = [...prev.options];
     updated[index] = value;
     return { ...prev, options: updated };
   });
 };

 const addOption = () =>
   setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));

 const removeOption = (index) =>
   setFormData((prev) => {
     const updated = prev.options.filter((_, i) => i !== index);
     return { ...prev, options: updated.length ? updated : [""] };
   });


  const validateForm = () => {
    if (!formData.questions.trim()) {
      setError("Question is required");
      return false;
    }
    if (!formData.order) {
      setError("Question order is required");
      return false;
    }
    if (
      (formData.answerType === "MultipleChoice" ||
        formData.answerType === "Yes/No") &&
      formData.options.some((o) => !o || !o.toString().trim())
    ) {
      setError("All options must have labels");
      return false;
    }
    setError(null);
    return true;
  };

 const handleSave = async () => {
  console.log("Save clicked", formData);
  if (!validateForm()) {
    console.log("Validation failed", formData);
    return;
  }
  if (!assessment) {
    console.log("No assessment found");
    setError("No free assessment found to attach this question.");
    return;
  }

  setIsSubmitting(true);


    try {
      const payload = {
        assessmentId: Number(assessment.id),
        questions: formData.questions.trim(),
        order: Number(formData.order),
        answerType: formData.answerType,
        options: formData.options,
        questiontypeid: Number(categoryId), // pass the category id here
        variant: formData.variant,
      };

      console.log("Payload to send:", {
        assessmentId: Number(assessment.id),
        questions: formData.questions,
        order: Number(formData.order),
        answerType: formData.answerType,
        options: formData.options,
        questiontypeid: Number(categoryId), // pass the category id here
        variant: formData.variant,
      });

      const savedQuestion = editingQuestion
        ? await updateQuestion(editingQuestion.id, payload)
        : await addQuestion(payload);
      console.log("saved question", savedQuestion);

      onSave(savedQuestion);
if (fetchQuestions) fetchQuestions();

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
        <div className="w-full border px-3 py-2 rounded mb-3 text-xs">
          {/* <p>{assessment?.name || "Initial Assessment"}</p> */}

          <p>Initial Assessment</p>
        </div>
        {/*    <label className="block text-xs mb-1 font-medium text-gray-700">
          Question Category
        </label>
        <div className="w-full border px-3 py-2 rounded mb-4 text-xs text-gray-600">
          <p>{categoryName || "N/A"}</p>
        </div> */}

        <label className="block text-xs mb-1">Question</label>
        <textarea
          className="w-full border px-2 py-1 rounded mb-4 text-xs"
          rows={2}
          value={formData.questions}
          onChange={(e) => handleChange("questions", e.target.value)}
          placeholder="Enter Question"
        />
        <label className="block text-xs mb-1">Question Variant </label>
        <select
          className="w-full border px-3 py-2 rounded mb-3 text-xs"
          value={formData.variant}
          onChange={(e) => handleChange("variant", e.target.value)}
        >
          <option value="">Select Variant</option>
          <option value="internal">Internal</option>
        </select>

        <label className="block text-xs mb-1">Question Order</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4 text-xs"
          value={formData.order}
          onChange={(e) => handleChange("order", e.target.value)}
          placeholder="Enter question order (number)"
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
        {(formData.answerType === "MultipleChoice" ||
          formData.answerType === "Yes/No") && (
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

        <div className="flex justify-between gap-3 text-sm">
          <button
            className="px-4 py-2 rounded-full bg-gray-200"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-full bg-[#114654] text-white text-sm"
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
