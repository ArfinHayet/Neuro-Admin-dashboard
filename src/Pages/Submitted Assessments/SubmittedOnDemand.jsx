import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { users, children, categories } from "../../Components/utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getAllSubmissions } from "../../api/submissions";
import { getAnswersByAssessmentId } from "../../api/answers";

const SubmittedOnDemand = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubmissions();
      const submissionsData = data?.payload || [];

      const onDemandSubmissions = submissionsData.filter(
        (submission) => submission.assessmentId !== 12
      );
      //  console.log(" submissions list:", onDemandSubmissions);

      setSubmissions(onDemandSubmissions);
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
    navigate(`/submitted-assessments/on-demand/${id.assessmentId}`);
  };

  const data = useMemo(() => submissions, [submissions]);

  const columns = useMemo(
    () => [
      {
        header: "User Name",
        accessorFn: (row) => row.user?.name || "Unknown User",
      },
      {
        header: "Child Name",
        accessorFn: (row) => row.patient?.name || "Unknown Child",
      },
      // {
      //   header: "Assessment Name",
      //   accessorFn: (row) => row.assessment?.name || "Unknown Assessment",
      // },
      {
        header: "Category",
        accessorFn: (row) => row.assessment?.category || "N/A",
      },
      {
        header: "Score",
        accessorFn: (row) => row.score || "N/A",
      },
      {
        header: "Date Taken",
        accessorFn: (row) =>
          new Date(row.createdAt).toLocaleDateString("en-GB"),
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
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
      <h1 className="text-xl font-semibold ">Submitted On-Demand Assessments</h1>
      <p className="text-sm mb-4 text-secondary">
        Access and Review Detailed Records of Every Submitted Assessment.
      </p>

      {loading ? (
        <p className="text-center py-10 text-gray-500">
          Loading submissions...
        </p>
      ) : (
        <>
          <p className="mb-2 ">Total submitted: {submissions?.length}</p>
          <div className="bg-white rounded border border-opacity-30 ">
            <DataTable table={table} />
          </div>
        </>
      )}
    </section>
  );
};
export default SubmittedOnDemand;
