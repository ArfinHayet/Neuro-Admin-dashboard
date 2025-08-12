import React from "react";
import { useNavigate } from "react-router-dom";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { clinicians } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";

const CliniciansList = () => {
  const navigate = useNavigate();
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: "Clinician",
      cell: ({ row }) => {
        const clinician = row.original;
        return (
          <div className="flex items-start">
            <img
              src={clinician.image}
              alt={clinician.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-4 text-left">
              <div className="font-medium text-gray-900 text-base">
                {clinician.name}
              </div>
              <div className="text-xs text-gray-500">{clinician.title}</div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
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
    columnHelper.accessor("casesTaken", {
      header: "Cases Taken",
      cell: ({ getValue }) => `${getValue()} Cases`,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => navigate(`/clinicians/${row.original.id}`)}
          className="text-sm bg-primary text-white rounded-full px-3 py-1 hover:bg-primary-dark"
        >
          View profile
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
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5 pb-20">
      <h1 className="font-medium text-2xl mb-4">Clinicians</h1>
      <div className="bg-white rounded-lg px-2 w-[80vw] overflow-x-auto">
        <DataTable table={table} />
      </div>
    </section>
  );
};

export default CliniciansList;
