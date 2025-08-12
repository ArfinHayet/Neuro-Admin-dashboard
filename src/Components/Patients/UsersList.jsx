import React from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../Common/DataTable";

const UsersList = () => {
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
            className="flex items-center bg-primary px-3 py-1 text-white rounded-full text-sm hover:bg-primary-dark"
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
    <div className="p-2 w-[75vw] bg-white rounded-xl overflow-x-auto table-wrapper">
      <DataTable table={table} />
    </div>
  );
};

export default UsersList;
