import React, { useState, useEffect } from "react";
import { createAssessment } from "../../api/assessments";

const CategoryModal = ({ isOpen, onClose, onSave, defaultCategory }) => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [type, setType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory.category || "");
      setDescription(defaultCategory.description || "");
      setTotalTime(defaultCategory.totalTime || "");
      setType(defaultCategory.type || "");
    } else {
      setCategory("");
      setDescription("");
      setTotalTime("");
      setType("");
    }
    setError(null);
  }, [defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!category.trim()) {
      setError("Category is required");
      return;
    }

    if (!totalTime || parseInt(totalTime) <= 0) {
      setError("Completion time is required");
      return;
    }

    if (!type) {
      setError("Assessment type is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const assessmentData = {
        name: name.trim() || "Cognitive Ability Test",
        description: description.trim(),
        type: type,
        totalTime: `${totalTime} minutes`,
        category: category.trim(),
      };

      console.log("saving data", assessmentData);

      const response = await createAssessment(assessmentData);

      if (response.error) {
        throw new Error(response.error);
      }

      if (onSave) {
        await onSave(response.payload);
      }
      
      setDescription("");
      setTotalTime("");
      setType("");      
      setCategory("");


      onClose();
    } catch (err) {
      console.error("Failed to save assessment:", err);
      setError(err.message || "Failed to save assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDescription("");
    setTotalTime("");
    setType("");
    setCategory("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] max-w-full">
        <h2 className="text-lg font-medium text-center mb-4">
          {defaultCategory ? "Edit Category" : "Add New Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-xs">Category Name</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs">
              Estimated Completion Time (minutes)
            </label>
            <input
              type="number"
              min={1}
              value={totalTime}
              onChange={(e) => setTotalTime(e.target.value)}
              placeholder="Enter time in minutes"
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs">Assessment Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-3 py-2 text-xs"
            >
              <option value="">Select Type</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-xs">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description "
              className="w-full border rounded px-3 py-2 resize-none text-xs"
              rows={2}
            />
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-full bg-gray-100 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-full text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
