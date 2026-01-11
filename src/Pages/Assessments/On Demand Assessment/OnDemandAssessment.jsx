/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegClock } from "react-icons/fa6";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  getAssessments,
  deleteAssessment,
  updateAssessment,
} from "../../../api/assessments";
import CategoryModal from "../../../Components/Assessments/CategoryModal";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import toast, { Toaster } from "react-hot-toast";
import { getProducts } from "../../../api/products";
import { IoReorderThreeOutline } from "react-icons/io5";

const AssessmentCard = ({ category, onEdit, onDelete, onSelect, priceMap }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);

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
      setShowDeleteModal(true); // open modal
      setIsMenuOpen(false);
    };

    const handleConfirmDelete = async () => {
      try {
        if (onDelete) await onDelete(category); // call parent delete
        setShowDeleteModal(false); // close modal
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete assessment");
      }
    };

  // bg-[#ecfafe]
  return (
  <>
    <section className="border border-slate-200 rounded-xl p-4 relative min-h-[120px]">
      <div className="flex justify-between items-stretch h-full w-full">
        <div className="flex gap-4 items-center">
          <IoReorderThreeOutline size={24} />
          <div className="flex flex-col gap-1.5 justify-start items-start">
            <p className="text-xs text-center px-2 py-1 rounded-full bg-slate-100">
              {category?.category} 
            </p>
            <h2 className="font-semibold text-sm">#{category?.id} {category?.name}</h2>
            <p className="text-xs text-secondary w-[62vw]">
              {(category?.description || "").slice(0, 160)}
              {(category?.description || "").length > 160 ? "..." : ""}
            </p>

            <div className="flex gap-2">
              <div className="py-1 px-2 rounded-full bg-amber-100">
                <p className="text-xs capitalize text-amber-700">
                  {category?.type}
                </p>
              </div>
              <div className="bg-emerald-100/60 px-2 py-1 rounded-full">
                <p className="text-xs text-emerald-800 font-medium">
                  £ {priceMap[category.priceId] ?? "null"}
                </p>
              </div>
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                <FaRegClock size={12} />
                <p className="text-xs text-center"> {category.totalTime}</p>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between items-end self-stretch -my-2">
          <div className="flex gap-2 items-center relative">
            <div ref={menuRef} className="top-4 right-4">
              <button onClick={handleMenuClick} title="Options">
                <PiDotsThreeVerticalBold size={22} />
              </button>
            </div>

            {isMenuOpen && (
              <div className="absolute top-1 right-0 bg-white border border-gray-200 rounded-md z-50 w-28 shadow-md">
                <button
                  onMouseDown={handleEditClick}
                  className="w-full text-left px-4 py-1.5 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiEdit3 size={14} />
                  Edit
                </button>
                <button
                  onMouseDown={handleDeleteClick}
                  className="w-full text-left px-4 py-1.5 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => onSelect(category)}
              className="bg-[#114654] text-white text-xs py-1.5 px-3 rounded-full w-fit self-end"
            >
              Show Details
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Modal moved OUTSIDE the section - this is the key fix */}
    {showDeleteModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
          <p className="text-sm mb-4">
            Are you sure you want to delete "{category.name}"?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </>
    // <section className=" border border-slate-200 rounded-xl p-4  relative min-h-[120px] ">
    //   <div className="flex justify-between items-stretch h-full w-full">
    //     <div className="flex gap-4 items-center ">
    //       <IoReorderThreeOutline size={24} />
    //       <div className="flex flex-col gap-1.5 justify-start items-start ">
    //         <p className="text-xs text-center px-2 py-1  rounded-full bg-slate-100">
    //           {category?.category}
    //         </p>
    //         <h2 className=" font-semibold   text-sm">{category?.name}</h2>
    //         <p className="text-xs text-secondary w-[62vw]">
    //           {/* {category?.description} */}
    //           {(category?.description || "").slice(0, 160)}
    //           {(category?.description || "").length > 160 ? "..." : ""}
    //         </p>

    //         <div className="flex gap-2">
    //           <div className="py-1 px-2 rounded-full bg-amber-100">
    //             <p className="text-xs  capitalize text-amber-700">
    //               {category?.type}
    //             </p>
    //           </div>
    //           <div className="bg-emerald-100/60 px-2 py-1 rounded-full">
    //             <p className="text-xs text-emerald-800 font-medium">
    //               £ {priceMap[category.priceId] ?? "null"}
    //             </p>
    //           </div>
    //           <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full  ">
    //             <FaRegClock size={12} />
    //             <p className="text-xs text-center"> {category.totalTime}</p>
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //     {/* Menu wrapper (button + dropdown) */}
    //     <div className="flex flex-col justify-between items-end self-stretch">
    //       <div className="flex gap-2  items-center relative ">
    //         <div ref={menuRef} className=" top-4 right-4">
    //           <button onClick={handleMenuClick} title="Options">
    //             <PiDotsThreeVerticalBold size={22} />
    //           </button>
    //         </div>
    //         {/* Options box */}
    //         {isMenuOpen && (
    //           <div className="absolute top-2 right-0 bg-white border border-gray-200 rounded-md z-50 w-28 shadow-md">
    //             <button
    //               // onClick={handleEditClick}
    //               onMouseDown={handleEditClick}
    //               className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
    //             >
    //               <FiEdit3 size={14} />
    //               Edit
    //             </button>
    //             <button
    //               onClick={handleDeleteClick}
    //               className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
    //             >
    //               <FiTrash2 size={14} />
    //               Delete
    //             </button>
    //           </div>
    //         )}
    //       </div>

    //       <div>
    //         <button
    //           onClick={() => onSelect(category)}
    //           className="bg-[#114654] text-white text-xs py-1.5 px-3 rounded-full w-fit self-end"
    //         >
    //           Show Details
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    //   {showDeleteModal && (
    //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
    //       <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
    //         <p className="text-sm mb-4">
    //           Are you sure you want to delete "{category.name}"?
    //         </p>
    //         <div className="flex justify-center gap-4">
    //           <button
    //             onClick={handleConfirmDelete}
    //             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
    //           >
    //             Yes, Delete
    //           </button>
    //           <button
    //             onClick={() => setShowDeleteModal(false)}
    //             className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-sm"
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    //   {/* {showDeleteModal && (
    //     <div className="fixed inset-0  flex items-start justify-center bg-black bg-opacity-20 z-50">
    //       <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
    //         <p className="text-sm mb-4">
    //           Are you sure you want to delete "{category.category}"?
    //         </p>
    //         <div className="flex justify-center gap-4">
    //           <button
    //             onClick={handleConfirmDelete}
    //             className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-80 text-sm"
    //           >
    //             Yes
    //           </button>
    //           <button
    //             onClick={() => setShowDeleteModal(false)}
    //             className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
    //           >
    //             No
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )} */}
    // </section>
  );
};

const OnDemandAssessment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [editingAssessments, setEditingAssessments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [priceMap, setPriceMap] = useState({});

  const fetchPrices = async () => {
    try {
      const data = await getProducts();
      console.log("price", data);

      if (data) {
        const map = {};

        data.forEach((product) => {
          (product.prices || []).forEach((p) => {
            map[p.priceId] = p.unit_amount ? p.unit_amount / 100 : 0;
          });
        });

        console.log("price format", map);
        setPriceMap(map);
      }
    } catch (err) {
      console.error("Error fetching prices", err);
    }
  };

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const response = await getAssessments();
      const data = response.payload || [];
      const filtered = Array.isArray(data)
        ? data.filter((a) => a.type !== "free")
        : [];
      // console.log("Assessments data:", filtered);
      setAssessments(Array.isArray(filtered) ? filtered : []);
      console.log("assessments",filtered);
    } catch (err) {
      setError("Failed to load assessments");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    fetchAssessments();
  }, []);

  const handleCardClick = (category) => {
    navigate(`/ondemandassessment/${category.id}`, {
      state: { priceMap },
    });
  };

  const handleEditingAssessments = (category) => {
    setEditingAssessments(category);
    setIsModalOpen(true);
  };

  // const handleSaveCategory = async (assessment) => {
  //   try {
  //     if (editingAssessments) {
  //       const updated = await updateAssessment(editingAssessments.id, assessment);

  //     setAssessments((prev) =>
  //   prev.map((a) => (a.id === editingAssessments.id ? updated : a))
  // );

  //       toast.success("Assessment updated");
  //     }

  //     setIsModalOpen(false);
  //     setEditingAssessments(null);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Update failed");
  //   }
  // };

  const handleSaveCategory = (assessment) => {
    if (editingAssessments) {

      setAssessments((prev) =>
        prev.map((a) => (a.id === editingAssessments.id ? assessment : a))
      );
      toast.success("Assessment updated");
    } else {

      setAssessments((prev) => [...prev, assessment]);
      toast.success("Assessment added");
    }

    setIsModalOpen(false);
    setEditingAssessments(null);
  };

  if (isLoading) {
    return (
      <section className="h-[90vh] flex flex-col justify-center items-center">
        <div className="custom-loader"></div>
        <p className="mt-4 text-sm text-gray-500">Loading assessments...</p>
      </section>
    );
  }

  const handleDeleteAssessments = async (category) => {
    try {
      await deleteAssessment(category.id);

      setAssessments((prev) => prev.filter((a) => a.id !== category.id));

      toast.success("Assessment deleted successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch (err) {
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
    <section className=" ">
      <div className="flex justify-between items-start">
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

      <div className="flex flex-col gap-4">
        {assessments.map((category) => (
          <AssessmentCard
            key={category.id}
            category={category}
            onEdit={handleEditingAssessments}
            onSelect={handleCardClick}
            onDelete={handleDeleteAssessments}
            priceMap={priceMap}
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
