import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getAllSubmissions, getSubmissionsPage } from "../../api/submissions";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const SubmittedInitialList = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getSubmissionsPage(page, limit); // ✅ paged API
      const submissionsData = data?.payload || [];

      const initialSubmissions = submissionsData.filter(
        (submission) => submission.assessment?.type === "free"
      );

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
  }, [page]);

  const onView = (submission) => {
    navigate(`/submitted-assessments/initial/${submission.id}`);
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
        cell: (info) =>
          info.row.original.score !== null ? info.row.original.score : "N/A",
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
    getRowId: (row) => row.id.toString(),
  });

  return (
    <section className=" ">
      <h1 className="text-xl font-semibold">Submitted Initial Assessments</h1>
      <p className="text-sm mb-4 text-secondary">
        Access and Review Detailed Records of Every Submitted Assessment.
      </p>
      {loading ? (
        <p className="text-center py-10 text-gray-500">
          Loading submissions...
        </p>
      ) : (
        <>
          <div className="relative w-[78vw] h-[73vh] bg-white  overflow-x-auto">
            <DataTable table={table} />
          </div>

          {/* pagination */}
          <div className="absolute flex justify-end items-center gap-1 right-10 bottom-3">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="py-1 rounded bg-gray-200 disabled:opacity-60"
            >
              <IoIosArrowBack size={18} />
            </button>

            <span className="text-sm p-2">Page {page}</span>

            <button
              onClick={() =>
                setPage((prev) =>
                  submissions.length < limit ? prev : prev + 1
                )
              }
              disabled={submissions.length < limit}
              className="py-1 rounded bg-gray-200 disabled:opacity-60"
            >
              <IoIosArrowForward size={18} />
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default SubmittedInitialList;
