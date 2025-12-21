import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getSubmissionsPage, getAllSubmissions, deleteSubmission } from "../../api/submissions";

const SubmittedOnDemand = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const limit = 20;

  
    const [showModal, setShowModal] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  

  // Group submissions by assessmentId + patientId
  const groupSubmissions = (submissions) => {
    const map = new Map();

    submissions.forEach((sub) => {
      const key = `${sub.assessmentId}_${sub.patientId}`;
      if (!map.has(key)) {
        map.set(key, { ...sub, grouped: [sub] });
      } else {
        map.get(key).grouped.push(sub);
      }
    });

    return Array.from(map.values());
  };

  // Fetch paginated submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getSubmissionsPage(page, limit);
      const submissionsData = data?.payload || [];

      const onDemandSubmissions = submissionsData.filter(
        (submission) => submission.assessment?.type !== "free"
      );

      const grouped = groupSubmissions(onDemandSubmissions);

      setSubmissions(grouped);
      console.log(grouped);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch total count across all pages
  const fetchTotal = async () => {
    try {
      const all = await getAllSubmissions();
      const filtered = all?.payload?.filter(
        (submission) => submission.assessmentId !== 31
      );
      setTotalSubmissions(filtered.length);

    } catch (err) {
      console.error("Failed to fetch total submissions:", err);
      setTotalSubmissions(0);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [page]);

  useEffect(() => {
    fetchTotal();
  }, []);

  const onView = (row) => {
    navigate(
      `/submitted-assessments/on-demand/${row.assessmentId}_${row.patientId}`,
      {
        state: { submissions: row.grouped }, // pass all grouped submissions
      }
    );
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
      {
        header: "Assessment Name",
        accessorFn: (row) => row.assessment?.name || "N/A",
      },
      // {
      //   header: "Score",
      //   accessorFn: (row) => {
      //     const scores = row.grouped
      //       .map((s) => s.score)
      //       .filter((s) => s != null);
      //     if (!scores.length) return "N/A";
      //     return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
      //   },
      // },
      // {
      //   header: "questionType",
      //   accessorFn: (row) => row.questionType ?? "N/A",
      // },
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
    getRowId: (row) => `${row.assessmentId}_${row.patientId}`,
  });

  return (
    <section className=" ">
      <h1 className="text-xl font-semibold">Submitted On-Demand Assessments</h1>
      <p className="text-sm mb-4 text-secondary">
        Access and Review Detailed Records of Every Submitted Assessment.
      </p>

      {loading ? (
        <p className="text-center py-10 text-gray-500">
          Loading submissions...
        </p>
      ) : (
        <>
          <div className="relative w-[78vw] h-[73vh] bg-white overflow-x-auto">
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

export default SubmittedOnDemand;



