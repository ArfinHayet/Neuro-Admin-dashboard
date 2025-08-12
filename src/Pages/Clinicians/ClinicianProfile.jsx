import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  clinicians,
  clinicianAssessments,
  clinicianLeaves,
} from "../../Components/utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import toast from "react-hot-toast";
import DataTable from "../../Components/Common/DataTable";

const ClinicianProfile = () => {
  const { id } = useParams();
  const clinician = clinicians.find((c) => c.id.toString() === id);

  const leavesData = clinicianLeaves[id] || [];
  const [leaves, setLeaves] = useState(leavesData);

  useEffect(() => {
    setLeaves(leavesData);
  }, [id, leavesData]);

  const assessments = clinicianAssessments[id] || [];

  const handleApprove = useCallback(
    (leaveId) => {
      setLeaves((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status: "Approved" } : l))
      );
      toast.success("Leave approved");
    },
    [setLeaves]
  );

  const handleReject = useCallback(
    (leaveId) => {
      setLeaves((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status: "Rejected" } : l))
      );
      toast.error("Leave rejected");
    },
    [setLeaves]
  );

  const assessmentColumns = useMemo(
    () => [
      { 
        accessorKey: "assessmentName", 
        header: "Assessment Name" 
      },
      {
         accessorKey: "patientName", 
         header: "Patient Name" 
        },
      {
        accessorKey: "dateTaken",
        header: "Date Taken",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("en-GB"),
      },
    ],
    []
  );

  const leaveColumns = useMemo(
    () => [
      {
        accessorKey: "start",
        header: "Start Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("en-GB"),
      },
      {
        accessorKey: "end",
        header: "End Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("en-GB"),
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
    [handleApprove, handleReject]
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
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5 pb-20">
      <div className="flex items-center gap-6">
        <img
          src={clinician.image}
          alt={clinician.name}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold mb-1">{clinician.name}</h2>
          <p className="text-sm text-gray-600 mb-1">{clinician.title}</p>
          {clinician.bio && (
            <p className="text-sm text-gray-700 max-w-xl">{clinician.bio}</p>
          )}
        </div>
      </div>

      <div className="mt-4 bg-white p-4 rounded-lg w-[35vw]">
        <p className="text-sm text-gray-500">
          Joined on {new Date(clinician.joinedDate).toLocaleDateString("en-GB")}
        </p>
        {clinician.specialities && (
          <p className="text-sm text-gray-500 mt-2">
            <strong className="text-gray-700">Specialties </strong>{" "}
            {clinician.specialities.join(", ")}
          </p>
        )}
        {clinician.registrationInfo && (
          <p className="text-sm text-gray-500 mt-2">
            <strong className="text-gray-700">Registered in </strong>{" "}
            {clinician.registrationInfo}
          </p>
        )}
      </div>

      <section className="mt-6 space-y-8">
        <h3 className="text-lg font-medium mb-2">Ongoing Assessments</h3>
        <div className="bg-white p-4 rounded-lg">
          <DataTable table={assessmentTable} />
        </div>

        <h3 className="text-lg font-medium mb-2 mt-6">Leave Management</h3>
        <div className="bg-white p-4 rounded-lg">
          <DataTable table={leaveTable} />
        </div>
      </section>
    </section>
  );
};

export default ClinicianProfile;
