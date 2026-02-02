import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addQuestion } from "../../api/questionnaires";
import toast from "react-hot-toast";
import { IoIosArrowRoundBack } from "react-icons/io";

const AddQuestionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { assessment, categoryId, categoryName, categoryVariant } =
    location.state || {};

  const [formData, setFormData] = useState({
    questions: "",
    order: "",
    answerType: "Yes/No",
    options: [
      { label: "Yes", score: 0 },
      { label: "No", score: 0 },
    ],
    variant: "",
    domain: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [addedQuestions, setAddedQuestions] = useState([]);

  const resetForm = () => {
    setFormData({
      questions: "",
      order: "",
      answerType: "Yes/No",
      options: [
        { label: "Yes", score: 0 },
        { label: "No", score: 0 },
      ],
      variant: "",
      domain: "",
    });
    setError(null);
  };

  const handleChange = (field, value) => {
    if (field === "order") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    } else if (field === "answerType") {
      let options = [];
      if (value === "Yes/No") {
        options = [
          { label: "Yes", score: 0 },
          { label: "No", score: 0 },
        ];
      } else if (value === "MultipleChoice") {
        options = [{ label: "", score: 0 }];
      } else if (value === "Text") {
        options = [];
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
      updated[index] = { ...updated[index], label: value };
      return { ...prev, options: updated };
    });
  };

  const handleScoreChange = (index, value) => {
    if (
      formData.answerType !== "MultipleChoice" &&
      formData.answerType !== "Yes/No"
    )
      return;
    setFormData((prev) => {
      const updated = [...prev.options];
      updated[index] = { ...updated[index], score: Number(value) || 0 };
      return { ...prev, options: updated };
    });
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { label: "", score: 0 }],
    }));
  };

  const removeOption = (index) => {
    setFormData((prev) => {
      const updated = prev.options.filter((_, i) => i !== index);
      return {
        ...prev,
        options: updated.length ? updated : [{ label: "", score: 0 }],
      };
    });
  };

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
      formData.options.some((o) => !o.label || !o.label.trim())
    ) {
      setError("All options must have labels");
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    setAddedQuestions((prev) => [...prev, { ...formData }]);
    resetForm();
    setError(null);
    toast.success("Question added to queue");
  };

  const handleSaveAll = async () => {
    let questionsToSubmit = [...addedQuestions];

    if (formData.questions.trim()) {
      if (!validateForm()) return;
      questionsToSubmit.push({ ...formData });
    }

    if (questionsToSubmit.length === 0) {
      toast.error("No questions added");
      return;
    }

    setIsSubmitting(true);

    try {
      for (let q of questionsToSubmit) {
        const payload = {
          assessmentId: Number(assessment.id),
          questions: q.questions,
          order: Number(q.order),
          answerType: q.answerType,
          options: q.options,
          questiontypeid: Number(categoryId),
          variant: q.variant,
          domain: q.domain,
        };
        await addQuestion(payload);
      }
      toast.success("All questions added successfully");
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit questions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className=""> <button
            onClick={() => navigate(-1)}
            className="flex justify-center hover:rounded-full     text-sm text-gray-500 hover:text-gray-900 mb-2"
          >
            <IoIosArrowRoundBack size={20} /> Back to Questions
          </button>
        {/* Header */}
        <div className="mb-3 space-y-2 ">
         
          <h1 className=" font-semibold ">Add New Question</h1>
                  <p className="text-xs text-gray-500">
                      Input your questions by filling all the necessary fields.
            {/*  -   */}
                  </p>
                  <p className="text-sm ">
                      Assessment Name: <span className="font-semibold">{assessment?.name} </span>
                  </p>
                  <p className="text-sm">Question Category: <span className="font-semibold">{categoryName} -({categoryVariant})</span> </p>
        </div>

        {/* Form Card */}
        <div className="mt-6">
          <label className="block text-sm mb-2 font-medium text-gray-700">
            Question
          </label>
          <textarea
            className="w-full border border-gray-300 px-3 py-2 rounded mb-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            value={formData.questions}
            onChange={(e) => handleChange("questions", e.target.value)}
            placeholder="Enter your question here"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2 font-medium">Variant</label>
              <select
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
                value={formData.variant}
                onChange={(e) => handleChange("variant", e.target.value)}
              >
                <option value="">Select Variant</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">Order</label>
              <input
                type="text"
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
                value={formData.order}
                onChange={(e) => handleChange("order", e.target.value)}
                placeholder="e.g., 1, 2, 3"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium">Domain</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
              value={formData.domain}
              onChange={(e) => handleChange("domain", e.target.value)}
              placeholder="Enter domain"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium">
              Answer Type
            </label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
              value={formData.answerType}
              onChange={(e) => handleChange("answerType", e.target.value)}
            >
              <option value="Yes/No">Yes / No</option>
              <option value="MultipleChoice">Multiple Choice</option>
              <option value="Text">Text</option>
            </select>
          </div>

          {(formData.answerType === "MultipleChoice" ||
            formData.answerType === "Yes/No") && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium">Options</label>
                <button
                  type="button"
                  onClick={addOption}
                  className="text-xs bg-[#114654] px-3 py-1 rounded text-white hover:bg-[#114654]/80"
                >
                  + Add Option
                </button>
              </div>
              <div className="space-y-2">
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 px-3 py-1.5 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      value={opt.label}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                    />
                    <input
                      type="number"
                      className="w-20 border border-gray-300 px-3 py-1.5 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      value={opt.score}
                      onChange={(e) => handleScoreChange(i, e.target.value)}
                      placeholder="Score"
                    />
                    {formData.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="text-red-500 font-bold px-2 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Added Questions Preview */}
          {addedQuestions.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-sm font-medium text-green-800 mb-2">
                Questions in queue: {addedQuestions.length}
              </p>
              <ul className="text-xs text-green-700 space-y-1">
                {addedQuestions.map((q, i) => (
                  <li key={i}>• {q.questions}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-8 pb-4 border-t">
            <button
              className="px-5 py-2.5 rounded bg-gray-200 text-sm hover:bg-gray-300"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <div className="flex gap-3">
              <button
                className="px-5 py-2.5 rounded border border-[#114654] text-[#114654] text-sm hover:bg-gray-50"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Add More
              </button>

              <button
                className="px-5 py-2.5 rounded bg-[#114654] text-white text-sm hover:bg-[#114654]/80"
                onClick={handleSaveAll}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : `Save ${addedQuestions.length > 0 ? `All (${addedQuestions.length + (formData.questions.trim() ? 1 : 0)})` : ""}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPage;
