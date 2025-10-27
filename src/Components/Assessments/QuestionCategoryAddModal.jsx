
import { useState, useEffect } from "react";
import { addQuestionCategory, updateQuestionCategory } from "../../api/questioncategories";

const QuestionCategoryAddModal = ({ isOpen, onClose, onSave, editingCategory }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || "");
    } else {
      setName("");
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingCategory) {
        response = await updateQuestionCategory(editingCategory.id, { name });
      } else {
        response = await addQuestionCategory({ name });
      }

      if (response?.payload || response?.success) {
        onSave();
        onClose();
      }
    } catch (err) {
      console.error("Failed to save category", err);
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
