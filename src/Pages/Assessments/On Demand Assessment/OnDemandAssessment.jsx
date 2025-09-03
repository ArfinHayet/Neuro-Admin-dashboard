import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegClock } from "react-icons/fa6";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  createAssessment,
  getAssessments,
  deleteAssessment,
} from "../../../api/assessments";
import CategoryModal from "../../../Components/Assessments/CategoryModal";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import toast, { Toaster } from "react-hot-toast";

const AssessmentCard = ({ category, onEdit, onDelete, onSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(category);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) onDelete(category);
    setShowDeleteModal(false);

    toast.success("Assessment deleted successfully", {
      position: "top-right",
      duration: 3000,
    });
  };

  return (
    <section>
      <div className="bg-[#fafafa] border border-[#dfdfdf] rounded-xl p-4 h-[220px] relative flex items-center justify-center ">
        {/* Menu wrapper (button + dropdown) */}
        <div ref={menuRef} className="absolute top-4 right-4">
          <button onClick={handleMenuClick} title="Options">
            <PiDotsThreeVerticalBold size={20} />
          </button>

          {/* Options box */}
          {isMenuOpen && (
            <div className="absolute top-6 right-0 bg-white border border-gray-200 rounded-md z-10 w-28 shadow-md">
              <button
                onClick={handleEditClick}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FiEdit3 size={14} />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
              >
                <FiTrash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 justify-center items-center  mt-2">
          <h2 className=" font-semibold  text-center text-sm">
            {category.category}
          </h2>
          <p className="text-xs text-secondary  text-center">
            {category.description.slice(0, 40)}
            {category.description.length > 40 ? "..." : ""}
          </p>
          <span className="flex items-center gap-1 ">
            <FaRegClock size={14} />
            <p className="text-xs text-center">{category.totalTime}</p>
          </span>
          <p className="text-xs  capitalize">{category.type}</p>
          <p className="text-xs  ">£ {category.priceId}</p>

          <div className="flex justify-center">
            <button
              onClick={() => onSelect(category)}
              className="bg-[#114654] text-white text-xs py-1.5 px-3 rounded-full w-fit "
            >
              Show Details
            </button>
          </div>
        </div>
        {showDeleteModal && (
          <div className="fixed inset-0 pt-10 flex items-start justify-center bg-black bg-opacity-20 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
              <p className="text-sm mb-4">
                Are you sure you want to delete "{category.category}"?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-80 text-sm"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const OnDemandAssessment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [editingAssessments, setEditingAssessments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const response = await getAssessments();
      const data = response.payload || [];
      const filtered = Array.isArray(data)
        ? data.filter((a) => a.type !== "free")
        : [];
      console.log("Assessments data:", filtered);
      setAssessments(Array.isArray(filtered) ? filtered : []);
    } catch (err) {
      setError("Failed to load assessments");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleCardClick = (category) => {
    navigate(`/ondemandassessment/${category.id}`);
  };

  const handleEditingAssessments = (category) => {
    setEditingAssessments(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (assessment) => {
    try {
      // const saved = await createAssessment(assessment);
      //  console.log("saved assessments" , assessment)

      if (editingAssessments) {
        setAssessments((prev) =>
          prev.map((a) => (a.id === editingAssessments.id ? assessment : a))
        );
      } else {
        setAssessments((prev) => [...prev, assessment]);
      }

      setIsModalOpen(false);
      setEditingAssessments(null);
    } catch (err) {
      setError("Failed to save assessment");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <section className="h-[90vh] flex justify-center items-center rounded-2xl px-4 pt-5">
        <p>Loading assessments...</p>
      </section>
    );
  }

  const handleDeleteAssessments = async (category) => {
    try {
      await deleteAssessment(category.id);
      setAssessments((prev) => prev.filter((a) => a.id !== category.id));
    } catch (err) {
      setError("Failed to delete assessment");
      console.error(err);

      toast.error("Failed to delete assessment", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

 

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">On-Demand Assessments</h1>
        <button
          className="bg-[#114654] text-white px-4 py-2 rounded-full text-sm"
          onClick={() => {
            setEditingAssessments(null);
            setIsModalOpen(true);
          }}
        >
          Add New Category
        </button>
      </div>
      <p className="text-sm text-secondary mb-6">
        View, Edit and manage questions for the Initial Assessment to ensure
        accuracy and relevance.
      </p>

      <div className="grid grid-cols-4 gap-4">
        {assessments.map((category) => (
          <AssessmentCard
            key={category.id}
            category={category}
            onEdit={handleEditingAssessments}
            onSelect={handleCardClick}
            onDelete={handleDeleteAssessments}
          />
        ))}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAssessments(null);
        }}
        onSave={handleSaveCategory}
        defaultCategory={editingAssessments}
        onError={(err) => setError(err)}
      />
    </section>
  );
};

export default OnDemandAssessment;
