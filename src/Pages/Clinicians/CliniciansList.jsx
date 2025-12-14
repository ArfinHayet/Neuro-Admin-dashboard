import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getUsers } from "../../api/user";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { deleteUser } from "../../api/user";


const CliniciansList = () => {
  const navigate = useNavigate();
  const [clinicians, setClinicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 30;
    const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    const fetchClinicians = async () => {
      try {
        const data = await getUsers(page, limit);

        const filteredClinicians = (data.payload || []).filter(
          (user) => user.role === "clinician"
        );

        setClinicians(filteredClinicians);
        console.log(filteredClinicians)
      } catch (err) {
        console.error("Error loading clinicians:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicians();
  }, [page]);

   const handleDeleteUser = async (id) => {
     if (!id) {
       toast.error("User ID not found");
       return;
     }

     try {
       await deleteUser(id);
       toast.success("User deleted successfully");
       setShowModal(false);
       navigate("/patients");
     } catch (error) {
       console.error(error);
       toast.error("Failed to delete user");
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
      header: "HCPCTitle",
      accessorKey: "hcpcTitle",
      cell: (info) => info.row.original.hcpcTitle || "N/A",
    },
    {
      header: "Practice",
      accessorKey: "practiceName",
      cell: (info) => info.row.original.practiceName || "N/A",
    },
    {
      header: "RegNo",
      accessorKey: "regNo",
      cell: (info) => info.row.original.regNo || "N/A",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-left flex gap-2">
          <button
            onClick={() => navigate(`/clinicians/${row.original.id}`)} // backend id
            className="text-primary text-lg ml-3"
            aria-label={`View profile of ${row.original.name}`}
          >
            <IoEye />
          </button>
         <button
                  onClick={() => setShowModal(true)}
                  className="  text-[#114654] "
                >
                  <MdDeleteForever size={20} /> 
                </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: clinicians,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id?.toString(),
  });

  return (
    <section className=" ">
      <h1 className="font-semibold text-xl ">Clinicians</h1>
      <p className="text-secondary text-sm mb-4">
        Browse and manage all registered clinicians.
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          Loading clinicians...
        </div>
      ) : (
        <>
          <div className="relative  w-[78vw] h-[76vh] bg-white overflow-x-auto">
            <DataTable table={table} />
          </div>

          {/* pagination */}
          <div className="absolute flex justify-end items-center gap-1 right-10 bottom-8">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="py-1 rounded bg-gray-200 disabled:opacity-60"
            >
              <IoIosArrowBack size={18} />
            </button>

            <span className="text-sm p-2">Page {page}</span>

            <button
              onClick={() =>
                setPage((prev) => (clinicians.length < limit ? prev : prev + 1))
              }
              disabled={clinicians.length < limit}
              className="py-1 rounded bg-gray-200 disabled:opacity-60"
            >
              <IoIosArrowForward size={18} />
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center pt-12 bg-black bg-opacity-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-sm mb-4">
              Are you sure you want to delete this User?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDeleteUser(clinicians.id);
                  setShowModal(false);
                }}
                className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-80 text-sm"
              >
                Yes
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CliniciansList;
