import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { users, children, assessments } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";

const SubmittedInitialList = () => {
  const navigate = useNavigate();
  const initialAssessments = assessments.filter((a) => a.type === "initial");

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getChildName = (childId) => {
    const child = children.find((c) => c.id === childId);
    return child ? child.name : "Unknown Child";
  };

  const data = useMemo(() => initialAssessments, [initialAssessments]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "userName",
        header: "User Name",
        cell: info => getUserName(info.row.original.userId),
      },
      {
        accessorKey: "childName",
        header: "Child Name",
        cell: info => getChildName(info.row.original.childId),
      },
      {
        accessorKey: "dateTaken",
        header: "Date Taken",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => navigate(`/submitted-assessments/initial/${row.original.id}`)}
            className="px-3 py-1 bg-primary text-white text-sm rounded-full"
          >
            View Details
          </button>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <h1 className="text-2xl font-medium mb-2">Submitted Initial Assessments</h1>
      <p className="text-sm mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      <p className="mb-4">Total submitted: {initialAssessments.length}</p>

      <div className="bg-white rounded shadow p-4">
        <DataTable table={table} />
      </div>
    </section>
  );
};

export default SubmittedInitialList;
