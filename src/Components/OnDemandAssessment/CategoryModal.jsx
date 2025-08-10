import React, { useState, useEffect } from "react";

const CategoryModal = ({ isOpen, onClose, onSave, defaultCategory }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
const [duration, setDuration] = useState(""); 


  useEffect(() => {
    if (defaultCategory) {
      setName(defaultCategory.name || "");
      setDescription(defaultCategory.description || "");
      setDuration(defaultCategory.duration || "");
    } else {
      setName("");
      setDescription("");  
            setDuration("");
    
    }
  }, [defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name is required");

    onSave({ name, description });
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
            <label className="block mb-1 text-sm">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">
              Estimated Completion Time (minutes)
            </label>
            <input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter time in minutes"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              className="w-full border rounded px-3 py-2 resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-full "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
