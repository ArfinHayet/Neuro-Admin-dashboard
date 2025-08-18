import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { users } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getPatients } from "../../api/patient";

const PatientPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

 const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error("Error loading patients:", err);
      } 
    };

  const columns = [
    {
      header: "Name",
      accessorFn: (row) => row.name,
      cell: ({ row }) => <p className="text-xs">{row.original.name}</p>,
    },
    {
      header: "Email",
      accessorFn: (row) => row.email,
      cell: ({ row }) => <p className="text-xs">{row.original.email}</p>,
    },

    {
      header: "Gender",
      accessorFn: (row) => row.gender,
      cell: ({ row }) => <p className="text-xs">{row.original.gender}</p>,
    },
    {
      header: "Role",
      accessorFn: (row) => row.relationshipToUser,
      cell: ({ row }) => (
        <p className="text-xs">{row.original.relationshipToUser}</p>
      ),
    },
    {
      header: "Status",
      accessorKey: "isBlocked",
      cell: ({ getValue }) =>
        getValue() ? (
          <span className="px-2 text-xs  inline-flex leading-5 rounded-full bg-red-100 text-red-800">
            Blocked
          </span>
        ) : (
          <span className="px-2 text-xs  inline-flex leading-5 rounded-full bg-green-100 text-green-800">
            Active
          </span>
        ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-left">
          <button
            onClick={() => navigate(`/patients/${row.original.userId}`)}
            className="text-primary  text-lg ml-3"
            aria-label={`View profile of ${row.original.name}`}
          >
            <IoEye />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <h1 className="font-semibold text-xl mb-1">Users List</h1>
        <p className="text-secondary text-sm mb-4">
          Manage and view all registered platform users.
        </p>
        <div className="p-2 w-[80vw] bg-white rounded-xl overflow-x-auto">
          <DataTable table={table} />
        </div>
      </div>
    </section>
  );
};

export default PatientPage;
