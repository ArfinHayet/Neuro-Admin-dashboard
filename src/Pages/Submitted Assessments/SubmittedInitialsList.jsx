import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { users, children, assessments } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";

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
        cell: (info) => getUserName(info.row.original.userId),
      },
      {
        accessorKey: "childName",
        header: "Child Name",
        cell: (info) => getChildName(info.row.original.childId),
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
            onClick={() =>
              navigate(`/submitted-assessments/initial/${row.original.id}`)
            }
            className="ml-2"
          >
            <IoEye size={18} />
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
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2">
      <div className="bg-white h-[88vh] p-2 rounded-md overflow-y-auto">
        <h1 className="text-xl font-medium ">Submitted Initial Assessments</h1>
        <p className="text-sm mb-6 text-secondary">
          Access and Review Detailed Records of Every Submitted Assessment.{" "}
        </p>
        <p className="mb-2">Total submitted: {initialAssessments.length}</p>

        <div className="bg-white rounded border border-opacity-30 ">
          <DataTable table={table} />
        </div>
      </div>
    </section>
  );
};

export default SubmittedInitialList;
