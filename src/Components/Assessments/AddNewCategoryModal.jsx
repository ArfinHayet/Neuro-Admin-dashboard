import React, { useState, useEffect } from "react";


const AddNewCategoryModal = ({ isOpen, onClose, onSave, defaultCategory }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [categoryType, setCategoryType] = useState(""); 

  useEffect(() => {
    if (defaultCategory) {
      setName(defaultCategory.name || "");
      setDescription(defaultCategory.description || "");
      setDuration(defaultCategory.duration || "");
      setCategoryType(defaultCategory.categoryType || ""); 
    } else {
      setName("");
      setDescription("");
      setDuration("");
      setCategoryType("");
    }
  }, [defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name is required");

    onSave({ name, description, duration, categoryType }); 
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter time in minutes"
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs">Category Type</label>
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="w-full border rounded px-3 py-2 text-xs"
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-xs">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              className="w-full border rounded px-3 py-2 resize-none text-xs"
              rows={2}
            />
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-full bg-gray-100 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary  text-white rounded-full text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCategoryModal;
