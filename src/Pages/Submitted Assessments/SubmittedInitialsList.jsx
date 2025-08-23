import React, { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
//import { users, children,  } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getAllSubmissions } from "../../api/submissions";
import { getAnswersByAssessmentId } from "../../api/answers";

const SubmittedInitialList = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubmissions();
      const submissionsData = data?.payload || [];

      const initialSubmissions = (submissionsData || []).filter(
        // submission => submission.assessmentId === 12       //for initial 12 fixed
        (submission) => submission.assessmentId === 14
      );
      // console.log(" submissions from (assessmentId=12):", initialSubmissions);
      setSubmissions(initialSubmissions);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubmissions();
  }, []);

 const onView = (id) => {
    navigate(`/submitted-assessments/initial/${id.assessmentId}`);
  };

  const data = useMemo(() => submissions, [submissions]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "user.name",
        header: "User Name",
        cell: (info) => info.row.original.user?.name || "Unknown User",
      },
      {
        accessorKey: "patient.name",
        header: "Child Name",
        cell: (info) => info.row.original.patient?.name || "Unknown Child",
      },
      {
        accessorKey: "createdAt",
        header: "Date Taken",
        cell: (info) =>
          new Date(info.row.original.createdAt).toLocaleDateString(),
      },
      {
        accessorKey: "score",
        header: "Score",
        cell: (info) => `${info.row.original.score}` || "N/A",
      },
 {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <button
            onClick={() => onView(row.original)}
            className="px-2 p-1 hover:bg-gray-100 rounded"
            title="View Details"
          >
            <IoEye size={18} />
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-5">
      <h1 className="text-xl font-medium ">Submitted Initial Assessments</h1>
      <p className="text-sm mb-6 text-secondary">
        Access and Review Detailed Records of Every Submitted Assessment.{" "}
      </p>
      {loading ? (
        <p className="text-center py-10 text-gray-500">
          Loading submissions...
        </p>
      ) : (
        <>
          <p className="mb-2">Total submitted: {submissions?.length}</p>
          <div className="bg-white rounded border border-opacity-30 ">
            <DataTable table={table} />
          </div>
        </>
      )}
    </section>
  );
};

export default SubmittedInitialList;
