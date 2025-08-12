import React from "react";
import { useNavigate } from "react-router-dom";
import {
  assessments,
  users,
  children,
  categories,
} from "../../Components/utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";

const SubmittedOnDemand = () => {
  const navigate = useNavigate();
  const onDemandAssessments = assessments.filter((a) => a.type === "on-demand");

  const onView = (id) => {
    navigate(`/submitted-assessments/on-demand/${id}`);
  };

  const columns = [
    {
      header: "User Name",
      accessorKey: "userId",
      cell: ({ getValue }) => {
        const user = users.find((u) => u.id === getValue());
        return user ? user.name : "Unknown User";
      },
    },
    {
      header: "Child Name",
      accessorKey: "childId",
      cell: ({ getValue }) => {
        const child = children.find((c) => c.id === getValue());
        return child ? child.name : "-";
      },
    },
    {
      header: "Date Taken",
      accessorKey: "dateTaken",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("en-GB"),
    },
    {
      header: "Assessment Category",
      accessorKey: "categoryId",
      cell: ({ getValue }) => {
        const category = categories.find((cat) => cat.id === getValue());
        return category ? category.title : "Unknown Category";
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <button
          onClick={() => onView(row.original.id)}
          className="px-3 py-1 bg-[#114654] text-white rounded-full hover:bg-[#0e3d3a]"
        >
          View Details
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: onDemandAssessments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <h1 className="text-2xl font-medium mb-2">
        Submitted On-Demand Assessments
      </h1>
      <p className="text-sm mb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>

      <p className="mb-4 font-semibold">
        Total submitted: {onDemandAssessments.length}
      </p>

      <div className="bg-white rounded-xl p-4 overflow-x-auto">
        <DataTable table={table} />
      </div>
    </section>
  );
};

export default SubmittedOnDemand;
