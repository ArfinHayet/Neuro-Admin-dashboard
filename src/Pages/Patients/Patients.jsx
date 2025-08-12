import React from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { users } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";

const PatientPage = () => {
  const navigate = useNavigate();

  const columns = [
    {
      header: "User",
      accessorFn: (row) => row.name,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center">
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-4 flex flex-col items-start">
              <p className="font-medium text-base">{user.name}</p>
              <p className="text-xs">{user.email}</p>
            </div>
          </div>
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
          <span className="px-3 py-1 inline-flex leading-5 rounded-full bg-red-100 text-red-800">
            Blocked
          </span>
        ) : (
          <span className="px-3 py-1 inline-flex leading-5 rounded-full bg-green-100 text-green-800">
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
            className="flex items-center bg-[#114654] px-3 py-1 text-white rounded-full text-sm hover:bg-[#0e3d3a]"
            aria-label={`View profile of ${row.original.name}`}
          >
            View profile
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
      <h1 className="font-medium text-2xl mb-4">Users List</h1>
      <div className="p-2 w-[75vw] bg-white rounded-xl overflow-x-auto">
        <DataTable table={table} />
      </div>
    </section>
  );
};

export default PatientPage;
