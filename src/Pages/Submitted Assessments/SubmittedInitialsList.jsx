import React from "react";
import { useNavigate } from "react-router-dom";
import { users, children, assessments } from "../../Components/utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";

const SubmittedInitialList = () => {
  const navigate = useNavigate();
  const initialAssessments = assessments.filter((a) => a.type === "initial");

  const handleView = (assessmentId) => {
    navigate(`/submitted-assessments/initial/${assessmentId}`);
  };

  // Helper functions to get names
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getChildName = (childId) => {
    const child = children.find((c) => c.id === childId);
    return child ? child.name : "Unknown Child";
  };

  // Columns definition without useMemo
  const columns = [
    {
      header: "User Name",
      accessorFn: (row) => getUserName(row.userId),
      cell: (info) => info.getValue(),
    },
    {
      header: "Child Name",
      accessorFn: (row) => getChildName(row.childId),
      cell: (info) => info.getValue(),
    },
    {
      header: "Date Taken",
      accessorKey: "dateTaken",
      cell: (info) => info.getValue(),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleView(row.original.id)}
          className="px-3 py-1 bg-primary text-white text-sm rounded-full"
        >
          View Details
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: initialAssessments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <h1 className="text-2xl font-medium mb-2">Submitted Initial Assessments</h1>
      <p className="text-sm mb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <p className="mb-4 font-semibold">Total submitted: {initialAssessments.length}</p>

      <div className="bg-white rounded-xl p-4 overflow-x-auto">
        <DataTable table={table} />
      </div>
    </section>
  );
};

export default SubmittedInitialList;
