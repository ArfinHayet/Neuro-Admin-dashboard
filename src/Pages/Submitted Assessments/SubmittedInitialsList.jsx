import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getAllSubmissions, getSubmissionsPage } from "../../api/submissions";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { deleteSubmission } from "../../api/submissions";
import toast from "react-hot-toast";

const SubmittedInitialList = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  const [showModal, setShowModal] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

const groupByPatientAndDate = (submissions) => {
  const map = {};

  submissions.forEach((sub) => {
    const dateKey = sub.createdAt.split("T")[0]; //  YYYY-MM-DD from payload
    const key = `${sub.patientId}_${dateKey}`;

    if (!map[key]) {
      map[key] = {
        patientId: sub.patientId,
        patient: sub.patient,
        user: sub.user,
        submissionDate: dateKey, // store ISO style internally
        grouped: [sub],
      };
    } else {
      map[key].grouped.push(sub);
    }
  });

  return Object.values(map);
};
  
 const fetchSubmissions = async () => {
   try {
     setLoading(true);

     const data = await getAllSubmissions();
     const submissionsData = data?.payload || [];

     const initialSubmissions = submissionsData.filter(
       (sub) => sub.assessment?.type === "free",
     );

     const grouped = groupByPatientAndDate(initialSubmissions);

     // Latest first
     grouped.sort(
       (a, b) =>
         new Date(b.grouped[b.grouped.length - 1].createdAt) -
         new Date(a.grouped[a.grouped.length - 1].createdAt),
     );

     setSubmissions(grouped);
   } catch (err) {
     console.error(err);
     setSubmissions([]);
   } finally {
     setLoading(false);
   }
 };

  useEffect(() => {
    fetchSubmissions();
  }, [page]);

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteSubmission(id); // api call
      toast.success("Submission deleted successfully");
      setShowModal(false);
      // remove deleted submission from state
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete submission");
    }
  };

  const onView = (submission) => {
    navigate(`/submitted-assessments/initial/${submission.id}`);
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
  header: "Date Taken",
  accessorFn: (row) => {
    const d = new Date(row.submissionDate);
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  },
},
      {
        header: "Score",
        accessorFn: (row) => {
          if (!row.grouped?.length) return "N/A";

          // latest submission (based on createdAt)
          const latest = [...row.grouped].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )[0];

          return latest.score ?? "N/A";
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <button
            onClick={() =>
              navigate(
                `/submitted-assessments/initial/${row.original.patientId}`,
                {
                  state: { submissions: row.original.grouped },
                },
              )
            }
            className="px-2 p-1 text-gray-500"
          >
            <IoEye size={18} />
          </button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => `${row.patientId}_${row.submissionDate}`,
  });

  return (
    <section className=" ">
      <h1 className="text-xl font-semibold">Submitted Initial Assessments</h1>
      <p className="text-sm mb-4 text-secondary">
        Access and Review Detailed Records of Every Submitted Assessment.
      </p>
      {loading ? (
        <section className="h-[90vh] flex flex-col justify-center items-center">
          <div className="custom-loader"></div>
          <p className="mt-4 text-sm text-gray-500">
            Loading Assessment Submissions List...
          </p>
        </section>
      ) : (
        <>
          <div className="relative w-[79vw] h-[73vh] bg-white  overflow-x-auto">
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
                  submissions.length < limit ? prev : prev + 1,
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

      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center pt-12 bg-black bg-opacity-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-sm mb-4">
              Are you sure you want to delete this Submission?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDelete(selectedSubmissionId);
                  setShowModal(false);
                }}
                className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-80 text-sm"
              >
                Yes
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SubmittedInitialList;
