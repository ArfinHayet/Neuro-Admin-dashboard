import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { clinicians, clinicianAssessments, clinicianLeaves } from "../../Components/utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import toast from "react-hot-toast";
import DataTable from "../../Components/Common/DataTable";

const ClinicianProfile = () => {
  const { id } = useParams();
  const clinician = clinicians.find((c) => c.id.toString() === id);

  // Get data from utils by clinician ID
  const assessments = clinicianAssessments[id] || [];
  const leavesData = clinicianLeaves[id] || [];

  const [leaves, setLeaves] = useState(leavesData);

  const handleApprove = (leaveId) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status: "Approved" } : l))
    );
    toast.success("Leave approved");
  };

  const handleReject = (leaveId) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status: "Rejected" } : l))
    );
    toast.error("Leave rejected");
  };

  const assessmentColumns = useMemo(
    () => [
      { accessorKey: "assessmentName", header: "Assessment Name" },
      { accessorKey: "patientName", header: "Patient Name" },
      {
        accessorKey: "dateTaken",
        header: "Date Taken",
        cell: info => new Date(info.getValue()).toLocaleDateString("en-GB"),
      },
    ],
    []
  );

  const leaveColumns = useMemo(
    () => [
      {
        accessorKey: "start",
        header: "Start Date",
        cell: info => new Date(info.getValue()).toLocaleDateString("en-GB"),
      },
      {
        accessorKey: "end",
        header: "End Date",
        cell: info => new Date(info.getValue()).toLocaleDateString("en-GB"),
      },
      { accessorKey: "reason", header: "Reason" },
      { accessorKey: "status", header: "Status" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          if (row.original.status !== "Pending") return null;
          return (
            <div className="flex gap-2">
              <button
                className="text-green-600 hover:underline"
                onClick={() => handleApprove(row.original.id)}
              >
                Approve
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleReject(row.original.id)}
              >
                Reject
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const assessmentTable = useReactTable({
    data: assessments,
    columns: assessmentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const leaveTable = useReactTable({
    data: leaves,
    columns: leaveColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!clinician) return <p className="p-4">Clinician not found.</p>;

  return (
    <section className="mt-6 space-y-8">
      <section>
        <h3 className="text-lg font-semibold mb-2">Ongoing Assessments</h3>
        <div className="bg-white p-4 rounded-lg">
          <DataTable table={assessmentTable} />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Leave Management</h3>
        <div className="bg-white p-4 rounded-lg">
          <DataTable table={leaveTable} />
        </div>
      </section>
    </section>
  );
};

export default ClinicianProfile;
