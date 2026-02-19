// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
// import DataTable from "../../Components/Common/DataTable";
// import { IoEye } from "react-icons/io5";
// import { getUsers } from "../../api/user";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { MdDeleteForever } from "react-icons/md";
// import { deleteUser } from "../../api/user";
// import toast from "react-hot-toast";

// const CliniciansList = () => {
//   const navigate = useNavigate();
//   const [clinicians, setClinicians] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const limit = 30;
//     const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchClinicians = async () => {
//       try {
//         const data = await getUsers(page, limit);

//         const filteredClinicians = (data.payload || []).filter(
//           (user) => user.role === "clinician"
//         );

//         setClinicians(filteredClinicians);
//         console.log(filteredClinicians)
//       } catch (err) {
//         console.error("Error loading clinicians:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClinicians();
//   }, [page]);

//    const handleDeleteUser = async (id) => {
//      if (!id) {
//        toast.error("User ID not found");
//        return;
//      }

//      try {
//        await deleteUser(id);
//        toast.success("User deleted successfully");
//        setShowModal(false);
//        navigate("/patients");
//      } catch (error) {
//        console.error(error);
//        toast.error("Failed to delete user");
//      }
//    };

//   const columns = [
//     {
//       header: "Name",
//       accessorKey: "name",
//       cell: (info) => info.row.original.name || "N/A",
//     },
//     {
//       header: "Email",
//       accessorKey: "email",
//       cell: (info) => info.row.original.email || "N/A",
//     },
//     {
//       header: "Phone",
//       accessorKey: "phone",
//       cell: (info) => info.row.original.phone || "N/A",
//     },
//     {
//       header: "HCPCTitle",
//       accessorKey: "hcpcTitle",
//       cell: (info) => info.row.original.hcpcTitle || "N/A",
//     },
//     {
//       header: "Practice",
//       accessorKey: "practiceName",
//       cell: (info) => info.row.original.practiceName || "N/A",
//     },
//     {
//       header: "RegNo",
//       accessorKey: "regNo",
//       cell: (info) => info.row.original.regNo || "N/A",
//     },
//     // {
//     //   header: "Approval",
//     //   accessorKey: "approval",
//     // },
//     {
//       header: "Actions",
//       cell: ({ row }) => (
//         <div className="text-left flex gap-2">
//           <button
//             onClick={() => navigate(`/clinicians/${row.original.id}`)} // backend id
//             className="text-primary  ml-4"
//             aria-label={`View profile of ${row.original.name}`}
//           >
//             <IoEye size={16} />
//           </button>
//          <button
//                   onClick={() => setShowModal(true)}
//                   className="  text-[#114654] "
//                 >
//                   <MdDeleteForever size={18} />
//                 </button>
//         </div>
//       ),
//     },
//   ];

//   const table = useReactTable({
//     data: clinicians,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getRowId: (row) => row.id?.toString(),
//   });

//    if (loading) {
//      return (
//        <section className="h-[90vh] flex flex-col justify-center items-center">
//          <div className="custom-loader"></div>
//          <p className="mt-4 text-sm font-medium text-gray-500">Loading clinicians...</p>
//        </section>
//      );
//    }

//   return (
//     <section className=" ">
//       <h1 className="font-semibold text-xl ">Clinicians</h1>
//       <p className="text-secondary text-sm mb-4">
//         Browse and manage all registered clinicians.
//       </p>

//       {loading ? (
//         <div className="flex justify-center items-center h-40 text-gray-500">
//           Loading clinicians...
//         </div>
//       ) : (
//         <>
//           <div className="relative  w-[78vw] h-[76vh] bg-white overflow-x-auto">
//             <DataTable table={table} />
//           </div>

//           {/* pagination */}
//           <div className="absolute flex justify-end items-center gap-1 right-10 bottom-8">
//             <button
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               className="py-1 rounded bg-gray-200 disabled:opacity-60"
//             >
//               <IoIosArrowBack size={18} />
//             </button>

//             <span className="text-sm p-2">Page {page}</span>

//             <button
//               onClick={() =>
//                 setPage((prev) => (clinicians.length < limit ? prev : prev + 1))
//               }
//               disabled={clinicians.length < limit}
//               className="py-1 rounded bg-gray-200 disabled:opacity-60"
//             >
//               <IoIosArrowForward size={18} />
//             </button>
//           </div>
//         </>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 flex items-start justify-center pt-12 bg-black bg-opacity-20 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
//             <p className="text-sm mb-4">
//               Are you sure you want to delete this User?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => {
//                   handleDeleteUser(clinicians.id);
//                   setShowModal(false);
//                 }}
//                 className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-80 text-sm"
//               >
//                 Yes
//               </button>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default CliniciansList;

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import Pagination from "../../Components/Common/Pagination";
import { IoEye } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import { MdOutlineFilterList } from "react-icons/md";
import { getUsers, deleteUser } from "../../api/user";
import toast from "react-hot-toast";

const CliniciansList = () => {
  const navigate = useNavigate();
  const [clinicians, setClinicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 30;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPractice, setSelectedPractice] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchClinicians = async () => {
      try {
        setLoading(true);
        const data = await getUsers(page, limit);
        const filteredClinicians = (data.payload || []).filter(
          (user) => user.role === "clinician",
        );
        console.log(filteredClinicians)
        setClinicians(filteredClinicians);
      } catch (err) {
        console.error("Error loading clinicians:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClinicians();
  }, [page]);

  // Dynamic practice list from data
  const practices = useMemo(() => {
    const unique = [
      ...new Set(clinicians.map((c) => c.practiceName).filter(Boolean)),
    ];
    return ["All", ...unique];
  }, [clinicians]);

  // Client-side search + filter
  const filteredClinicians = useMemo(() => {
    return clinicians.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q);
      const matchesPractice =
        selectedPractice === "All" || c.practiceName === selectedPractice;
      return matchesSearch && matchesPractice;
    });
  }, [clinicians, searchQuery, selectedPractice]);

  const handleDeleteUser = async (id) => {
    if (!id) {
      toast.error("User ID not found");
      return;
    }
    try {
      await deleteUser(id);
      toast.success("Clinician deleted successfully");
      setShowModal(false);
      setSelectedId(null);
      setClinicians((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete clinician");
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => info.row.original.name || "N/A",
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (info) => info.row.original.email || "N/A",
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (info) => info.row.original.phone || "N/A",
    },
    {
      header: "HCPC Title",
      accessorKey: "hcpcTitle",
      cell: (info) => info.row.original.hcpcTitle || "N/A",
    },
    {
      header: "Practice",
      accessorKey: "practiceName",
      cell: (info) => info.row.original.practiceName || "N/A",
    },
    {
      header: "Reg No",
      accessorKey: "regNo",
      cell: (info) => info.row.original.regNo || "N/A",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/clinicians/${row.original.id}`)}
            className="text-primary hover:opacity-70 transition-opacity"
            aria-label={`View profile of ${row.original.name}`}
          >
            <IoEye size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedId(row.original.id);
              setShowModal(true);
            }}
            className="text-red-400 hover:text-red-600 transition-colors"
            aria-label={`Delete ${row.original.name}`}
          >
            <MdDeleteForever size={18} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredClinicians,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id?.toString(),
  });

  if (loading) {
    return (
      <section className="h-[90vh] flex flex-col justify-center items-center">
        <div className="custom-loader"></div>
        <p className="mt-4 text-sm text-gray-500">Loading clinicians...</p>
      </section>
    );
  }

  return (
    <section>
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="font-semibold text-xl text-gray-800">Clinicians</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Browse and manage all registered clinicians.
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex  items-end justify-end gap-2 -mt-12 mb-3">
        {/* Search */}
        <div className="relative  w-60">
          <HiOutlineSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-md bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          />
        </div>

        {/* Practice Filter */}
        <div className="relative">
          <MdOutlineFilterList
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <select
            value={selectedPractice}
            onChange={(e) => {
              setSelectedPractice(e.target.value);
              setPage(1);
            }}
            className="pl-7 pr-3 py-2 text-xs border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition appearance-none cursor-pointer"
          >
            {practices.map((p) => (
              <option key={p} value={p}>
                {p === "All" ? "All Practices" : p}
              </option>
            ))}
          </select>
        </div>

      
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden w-[79vw]">
        <div className="overflow-x-auto h-[72vh] overflow-y-auto">
          <DataTable table={table} emptyMessage="No clinicians found." />
        </div>
        </div>
        <Pagination
          page={page}
          onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setPage((prev) => (clinicians.length < limit ? prev : prev + 1))
          }
          hasNextPage={clinicians.length >= limit}
        />
     

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center pt-12 bg-black bg-opacity-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this clinician?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleDeleteUser(selectedId)}
                className="bg-red-500 text-white px-4 py-1.5 rounded text-xs hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedId(null);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded text-xs hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CliniciansList;