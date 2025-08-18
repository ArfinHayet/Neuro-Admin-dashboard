import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { users, children,  } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getSubmissions } from "../../api/submissionanswers";


const SubmittedInitialList = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);

  const fetchSubmissions = async () => {
      try {
        const data = await getSubmissions();
        const initialSubmissions = (data || []).filter(
          (item) => item.assessmentType === "initial"
        );
        setSubmissions(initialSubmissions);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        setSubmissions([]);
      } 
    };
    useEffect(() => {
      fetchSubmissions();
    }, []);

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getChildName = (childId) => {
    const child = children.find((c) => c.id === childId);
    return child ? child.name : "Unknown Child";
  };

  const data = useMemo(() => submissions, [submissions]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "userId",
        header: "User Name",
        cell: (info) => getUserName(info.row.original.userId),
      },
      {
        accessorKey: "patientId",
        header: "Child Name",
        cell: (info) => getChildName(info.row.original.patientId),
      },
      {
        accessorKey: "dateTaken",
        header: "Date Taken",
         cell: (info) =>
          new Date(info.row.original.dateTaken).toLocaleDateString(),
      
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
        <p className="mb-2">Total submitted: {submissions?.length}</p>

        <div className="bg-white rounded border border-opacity-30 ">
          <DataTable table={table} />
        </div>
      </div>
    </section>
  );
};

export default SubmittedInitialList;
