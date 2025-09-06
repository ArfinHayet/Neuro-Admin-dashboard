import { useState, useEffect, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import toast from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { getAssessments } from "../../api/assessments";
import { getUsers } from "../../api/user";

export default function TransactionLogs() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedClinician, setSelectedClinician] = useState("all");
  const [clinicians, setClinicians] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinicians = async () => {
      try {
        const res = await getUsers();
        const clinicianUsers = res.payload.filter(
          (u) => u.role === "clinician"
        );
        setClinicians(clinicianUsers);
      } catch (err) {
        console.error("Error fetching clinicians:", err);
      }
    };
    fetchClinicians();
  }, []);

  // Generate invoices from assessments
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await getAssessments();
        const assessments = res.payload || [];

        const grouped = assessments.reduce((acc, a) => {
          const clinicianId = a.userId; // assuming assessment.userId = clinician
          if (!clinicianId) return acc;

          if (!acc[clinicianId]) acc[clinicianId] = [];
          acc[clinicianId].push(a);
          return acc;
        }, {});

        const newInvoices = Object.keys(grouped).map((clinicianId, index) => {
          const logs = grouped[clinicianId];
          const totalAmount = logs.reduce(
            (sum, a) => sum + (parseFloat(a.price) || 0),
            0
          );
          const clinicianShare = totalAmount * 0.2;
          const clinician = clinicians.find((c) => c.id === Number(clinicianId));

          return {
            id: index + 1,
            clinician: clinician ? clinician.name : `Clinician #${clinicianId}`,
            clinicianId,
            date: new Date().toISOString().slice(0, 10),
            assessmentsCount: logs.length,
            totalAmount,
            clinicianShare,
            status: "Unpaid",
            assessments: logs,
          };
        });

        setInvoices(newInvoices);
      } catch (err) {
        console.error("Error generating invoices:", err);
      }
    };

    if (clinicians.length > 0) fetchAssessments();
  }, [clinicians]);

  const handleMarkAsPaid = (invoiceId) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "Paid" } : inv
      )
    );
    toast.success(`Invoice #${invoiceId} marked as Paid`);
  };

  const handleViewInvoice = (invoice) => {
    navigate(`/finances/invoices/${invoice.id}`, { state: { invoice } });
  };

  // Filtered data
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesClinician =
        selectedClinician === "all" ||
        String(inv.clinicianId) === String(selectedClinician);

      const invoiceMonth = new Date(inv.date).toLocaleString("default", {
        month: "long",
      });
      const matchesMonth =
        selectedMonth === "all" || invoiceMonth === selectedMonth;

      return matchesClinician && matchesMonth;
    });
  }, [invoices, selectedClinician, selectedMonth]);

  const months = [
    "all",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "clinician", header: "Clinician" },
    { accessorKey: "assessmentsCount", header: "# Assessments" },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: (info) => `£${info.getValue()}`,
    },
    {
      accessorKey: "clinicianShare",
      header: "Clinician Share",
      cell: (info) => `£${info.getValue()}`,
    },
   
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <button
          className={`text-xs px-2 py-1 rounded-full ${
            row.original.status === "Unpaid"
              ? "bg-[#e2f8c9] text-[#578206]"
              : "bg-[#f5f8b7] text-[#828006]"
          }`}
          onClick={() =>
            row.original.status === "Unpaid" &&
            handleMarkAsPaid(row.original.id)
          }
          disabled={row.original.status !== "Unpaid"}
        >
          {row.original.status}
        </button>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-3">
          <button
            className="text-secondary"
            onClick={() => handleViewInvoice(row.original)}
          >
            <IoEye size={16} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredInvoices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2 className="text-lg font-semibold text-primary">Transaction Logs</h2>
      <p className="mb-6 text-sm text-secondary">
        Track earnings, commission splits, and manage invoices
      </p>

      {/* Filters */}
      <div className="flex gap-10 mb-4">
        {/* Month Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded p-1 text-xs"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Clinician Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Clinician</label>
          <select
            value={selectedClinician}
            onChange={(e) => setSelectedClinician(e.target.value)}
            className="border rounded p-1 text-xs"
          >
            <option value="all">All</option>
            {clinicians.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable table={table} />
    </div>
  );
}
