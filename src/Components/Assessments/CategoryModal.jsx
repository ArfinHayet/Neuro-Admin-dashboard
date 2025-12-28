import React, { useState, useEffect } from "react";
import { createAssessment } from "../../api/assessments";
import { getProducts } from "../../api/products";

const CategoryModal = ({ isOpen, onClose, onSave, defaultCategory }) => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [type, setType] = useState("");
  const [priceId, setPriceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState([]);

  // Fetch all prices from backend
 useEffect(() => {
   const fetchPrices = async () => {
     try {
       const data = await getProducts();
       if (data && data.length > 0) {
         const allPrices = data.flatMap((product) => product.prices || []);

         const formattedPrices = allPrices.map((p) => ({
           ...p,
           amount: p.unit_amount ? p.unit_amount / 100 : 0,
         }));

         console.log("price", formattedPrices);
         setPrices(formattedPrices);
       }
     } catch (err) {
       console.error("Error fetching products", err);
     }
   };

   fetchPrices();
 }, []);


  // Populate form when editing
  useEffect(() => {
    if (defaultCategory) {
      setName(defaultCategory.name || "");
      setCategory(defaultCategory.category || "");
      setDescription(defaultCategory.description || "");
      setTotalTime(defaultCategory.totalTime || "");
      setType(defaultCategory.type || "");
      setPriceId(defaultCategory.priceId || "");
    } else {
      setName("");
      setCategory("");
      setDescription("");
      setTotalTime("");
      setType("");
      setPriceId("");
    }
    setError(null);
  }, [defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Name is required");
    if (!category.trim()) return setError("Category is required");
    if (!totalTime || parseInt(totalTime) <= 0)
      return setError("Completion time is required");
    if (!type) return setError("Assessment type is required");
    if (!priceId) return setError("Price is required");

    setIsSubmitting(true);

    try {
      const assessmentData = {
        name: name.trim(),
        description: description.trim(),
        type: type,
        totalTime: totalTime,
        category: category.trim(),
        priceId: priceId, // send priceId to backend
      };

      const response = await createAssessment(assessmentData);
      if (response.error) throw new Error(response.error);

      if (onSave) await onSave(response.payload);

      // Reset form
      setName("");
      setDescription("");
      setTotalTime("");
      setType("");
      setCategory("");
      setPriceId("");

      onClose();
    } catch (err) {
      console.error("Failed to save assessment:", err);
      setError(err.message || "Failed to save assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setTotalTime("");
    setType("");
    setCategory("");
    setPriceId("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 min-w-[480px] max-w-full">
        <h2 className="text-lg font-semibold text-center mb-4">
          {defaultCategory ? "Edit Assessment" : "Add New Assessment"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block mb-1 text-xs">Assessment Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter assessment name"
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>

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
            <label className="block mb-1 text-xs">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full border rounded px-3 py-2 resize-none text-xs"
              rows={2}
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
            <label className="block mb-1 text-xs">Price</label>
            <select
              value={priceId}
              onChange={(e) => setPriceId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-xs"
              required
            >
              <option value="">Select Price</option>
              {prices.map((p) => (
                <option key={p.priceId} value={p.priceId}>
                  {p.amount.toFixed(2)} {p.currency?.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 border rounded-full bg-gray-100 text-xs"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary text-white rounded-full text-xs"
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
