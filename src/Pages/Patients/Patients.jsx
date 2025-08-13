import React from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { users } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";

const PatientPage = () => {
  const navigate = useNavigate();

  const columns = [
    {
      header: "User",
      accessorFn: (row) => row.name,
      cell: ({ row }) => {
        const user = row.original;
        return (
            <p className=" text-sm">{user.name}</p>
        );
      },
    },
    {
      header: "Email",
      accessorFn: (row) => row.name,
      cell: ({ row }) => {
        const user = row.original;
        return (
            <p className="text-xs">{user.email}</p>
        );
      },
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (info) => info.getValue(),
    },
    {
      header: "Status",
      accessorKey: "isBlocked",
      cell: ({ getValue }) =>
        getValue() ? (
          <span className="px-3  inline-flex leading-5 rounded-full bg-red-100 text-red-800">
            Blocked
          </span>
        ) : (
          <span className="px-3  inline-flex leading-5 rounded-full bg-green-100 text-green-800">
            Active
          </span>
        ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-left">
          <button
            onClick={() => navigate(`/patients/${row.original.id}`)}
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
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <h1 className="font-medium text-2xl mb-1">Users List</h1>
        <p className="text-secondary text-sm mb-4">Manage and view all registered platform users.</p>

      <div className="p-2 w-[75vw] bg-white rounded-xl overflow-x-auto">
        <DataTable table={table} />
      </div>
    </section>
  );
};

export default PatientPage;
