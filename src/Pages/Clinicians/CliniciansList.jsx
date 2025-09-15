import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getUsers } from "../../api/user";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const CliniciansList = () => {
  const navigate = useNavigate();
  const [clinicians, setClinicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 30;

  useEffect(() => {
    const fetchClinicians = async () => {
      try {
        const data = await getUsers(page, limit);

        const filteredClinicians = (data.payload || []).filter(
          (user) => user.role === "clinician"
        );

        setClinicians(filteredClinicians);
      } catch (err) {
        console.error("Error loading clinicians:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicians();
  }, [page]);

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
      header: "Title",
      accessorKey: "hcpcTitle",
      cell: (info) => info.row.original.hcpcTitle || "N/A",
    },
    {
      header: "Practice",
      accessorKey: "practiceName",
      cell: (info) => info.row.original.practiceName || "N/A",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-left">
          <button
            onClick={() => navigate(`/clinicians/${row.original.id}`)} // backend id
            className="text-primary text-lg ml-3"
            aria-label={`View profile of ${row.original.name}`}
          >
            <IoEye />
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
          <div className="relative  w-[79vw] h-[70vh] bg-white overflow-x-auto">
            <DataTable table={table} />
          </div>

          {/* pagination */}
          <div className=" flex justify-end items-center gap-1 right-10 bottom-8">
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
    </section>
  );
};

export default CliniciansList;
