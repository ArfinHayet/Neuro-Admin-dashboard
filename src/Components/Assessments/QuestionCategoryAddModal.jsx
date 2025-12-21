import { useState, useEffect } from "react";
import {
  addQuestionCategory,
  updateQuestionCategory,
} from "../../api/questioncategories";
import { getAssessments } from "../../api/assessments";
import toast from "react-hot-toast";

const QuestionCategoryAddModal = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}) => {
  const [name, setName] = useState("");
  const [variant, setVariant] = useState("");
  const [assessment, setAssessment] = useState("");
  const [assessments, setAssessments] = useState([]);

  // Fetch assessments on mount
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await getAssessments();
        setAssessments(res?.payload || []);
      } catch (err) {
        console.error("Failed to fetch assessments", err);
      }
    };
    fetchAssessments();
  }, []);

   const resetForm = () => {
     setName("");
     setVariant("");
     setAssessment("");
   };

  // Populate fields if editing
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || "");
      setVariant(editingCategory.variant || "");
      setAssessment(editingCategory.assessmentId?.toString() || "");
    } else {
       resetForm();
    }
  }, [editingCategory]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let response;
    const payload = { name, variant, assessmentId: String(assessment) }; // include assessmentId
// console.log("Updating category with payload:", payload);

    if (editingCategory) {
      response = await updateQuestionCategory(editingCategory.id, payload);
      if (response?.payload || response?.success) {
        toast.success("Category updated successfully!");
        resetForm();
      }
    } else {
      response = await addQuestionCategory(payload);
      if (response?.payload || response?.success) {
        toast.success("Category added successfully!");
      }
    }

    if (response?.payload || response?.success) {
      onSave();
      onClose();
    }
  } catch (err) {
    console.error("Failed to save category", err);
    toast.error("Failed to save category");
  }
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          {editingCategory ? "Edit Category" : "Add Category"}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#114654]"
            required
          />
         
          <select
            required
            className="mt-4 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#114654]"

            value={variant}
            onChange={(e) => setVariant(e.target.value)}>
            <option>Select Variant</option>
            <option>internal</option>
            <option>external</option>
          </select>
          <select
            value={assessment}
            onChange={(e) => setAssessment(e.target.value)}
            className="mt-4 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#114654]"
            required
          >
            <option value="" disabled>
              Select assessment
            </option>
            {assessments.map((assess) => (
              <option key={assess.id} value={assess.id}>
                {assess.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#114654] text-white rounded-lg"
            >
              {editingCategory ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionCategoryAddModal;
