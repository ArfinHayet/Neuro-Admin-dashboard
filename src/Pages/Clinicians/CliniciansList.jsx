import React from "react";
import { useNavigate } from "react-router-dom";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { clinicians } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";

const CliniciansList = () => {
  const navigate = useNavigate();
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: "Clinician",
      cell: ({ row }) => {
        const clinician = row.original;
        return <p className="  text-xs">{clinician.name}</p>;
      },
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: ({ row }) => {
        const clinician = row.original;
        return <p className="text-xs text-gray-500">{clinician.title}</p>;
      },
    }),
    columnHelper.accessor("casesTaken", {
      header: "Cases Taken",
      cell: ({ getValue }) => `${getValue()} Cases`,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5  rounded-full ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => navigate(`/clinicians/${row.original.id}`)}
          className="text-lg text-primary ml-4"
        >
          <IoEye />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: clinicians,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <h1 className="font-semibold text-xl mb-1">Clinicians</h1>
        <p className="text-secondary text-sm mb-4">
          Browse and manage all registered clinicians.
        </p>

        <div className="p-2 w-[80vw] bg-white rounded-xl overflow-x-auto">
          <DataTable table={table} />
        </div>
      </div>
    </section>
  );
};

export default CliniciansList;
