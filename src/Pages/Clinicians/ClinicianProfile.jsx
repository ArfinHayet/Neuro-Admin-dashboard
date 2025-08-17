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
import { FaRegCheckCircle } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";

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
        header: "Assessment Name",
      },
      {
        accessorKey: "patientName",
        header: "Patient Name",
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
            <div className="flex gap-2 ml-2">
              <button
                className="text-green-600 hover:underline "
                onClick={() => handleApprove(row.original.id)}
              >
                <FaRegCheckCircle size={17} />
              </button>
              <button
                className="text-red-600 hover:underline "
                onClick={() => handleReject(row.original.id)}
              >
                <TiDeleteOutline size={22} />
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
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <div className="flex items-center gap-6 mb-4">
          <img
            src={clinician.image}
            alt={clinician.name}
            className="w-24 h-24 rounded-full"
          />
          <div className="space-y-1">
            <h2 className="text-xl font-semibold ">{clinician.name}</h2>
            <p className="text-sm text-gray-500">
              Joined on{" "}
              {new Date(clinician.joinedDate).toLocaleDateString("en-GB")}
            </p>

            {clinician.specialities && (
              <p className="text-sm text-gray-500 ">
                <strong className="text-gray-700">Specialties </strong>{" "}
                {clinician.specialities.join(", ")}
              </p>
            )}
            {clinician.registrationInfo && (
              <p className="text-sm text-gray-500 ">
                <strong className="text-gray-700">Registered in </strong>{" "}
                {clinician.registrationInfo}
              </p>
            )}
            {clinician.bio && (
              <p className="text-sm text-gray-700 max-w-xl">{clinician.bio}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-1">Ongoing Assessments</h3>
          <div className="bg-white p-2 rounded-lg">
            <DataTable table={assessmentTable} />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-1">Leave Management</h3>
          <div className="bg-white p-2 rounded-lg">
            <DataTable table={leaveTable} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicianProfile;
