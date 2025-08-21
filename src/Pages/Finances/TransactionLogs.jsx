import { useState, useEffect } from "react";
import { transactionLogs, clinicians } from "../../Components/utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import toast from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function TransactionLogs() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedClinician, setSelectedClinician] = useState("all");
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  const getPreviousMonth = () => {
    const today = new Date();
    const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const year =
      today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    return { prevMonth, year };
  };
  const generateInvoicesForLastMonth = () => {
    const { prevMonth, year } = getPreviousMonth();

    // Filter logs for previous month
    const prevMonthLogs = transactionLogs.filter((log) => {
      const d = new Date(log.date);
      return d.getMonth() === prevMonth && d.getFullYear() === year;
    });

    const grouped = prevMonthLogs.reduce((acc, log) => {
      //grouped clinician
      if (!acc[log.clinician]) acc[log.clinician] = [];
      acc[log.clinician].push(log);
      return acc;
    }, {});

    const newInvoices = Object.keys(grouped).map((clinician, index) => {
      const logs = grouped[clinician];
      const totalAmount = logs.reduce((sum, l) => sum + l.amount, 0);
      const clinicianShare = logs.reduce((sum, l) => sum + l.clinicianShare, 0);
      const platformShare = logs.reduce((sum, l) => sum + l.platformShare, 0);
      return {
        id: index + 1,
        clinician,
        date: new Date().toISOString().slice(0, 10),
        assessmentsCount: logs.length,
        totalAmount,
        clinicianShare,
        platformShare,
        status: "Unpaid",
      };
    });

    setInvoices(newInvoices);
  };

  useEffect(() => {
    generateInvoicesForLastMonth();
  }, []);
  const handleMarkAsPaid = (invoiceId) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "Paid" } : inv
      )
    );
    toast.success(`Invoice #${invoiceId} marked as Paid`);
  };

  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

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

  const filteredInvoices =
    selectedMonth === "all"
      ? invoices
      : invoices.filter((inv) => {
          const monthName = new Date(inv.date).toLocaleString("default", {
            month: "long",
          });
          return monthName === selectedMonth;
        });

  const columns = [
    {
       accessorKey: "date",
        header: "Date" 
      },
    {
       accessorKey: "clinician", 
       header: "Clinician" ,
      },
    { 
      accessorKey: "assessmentsCount",
       header: "# Assessments" ,
             cell: (info) => `${info.getValue()}`,

      },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: (info) => `$${info.getValue()}`,
    },
    {
      accessorKey: "clinicianShare",
      header: "Clinician Share",
      cell: (info) => `$${info.getValue()}`,
    },
    {
      accessorKey: "platformShare",
      header: "Platform Share",
      cell: (info) => `$${info.getValue()}`,
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
            onClick={() => handleViewInvoice(row.original.id)}
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
      <div>
        <h2 className="text-lg font-semibold text-primary">Transaction Logs</h2>
        <p className="mb-6 text-sm text-secondary">
          Track earnings, commission splits, and manage invoices
        </p>
      </div>

      <div className="flex justify-start gap-10 mb-4">

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded p-1 text-xs"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Clinician</label>
          <select
            value={selectedClinician}
            onChange={(e) => setSelectedClinician(e.target.value)}
            className="border rounded p-1 text-xs"
          >
            <option value="all">All</option>
            {clinicians.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="flex gap-6 items-center">
           invoice Generate 
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Clinician</label>
            <select
              value={selectedClinician}
              onChange={(e) => setSelectedClinician(e.target.value)}
              className="border rounded py-1 px-2 text-xs w-40"
            >
              <option value="">Select Clinician</option>
              {clinicians.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              className="bg-primary text-white px-3 py-1 rounded-full text-xs"
              onClick={handleGenerateInvoice}
            >
              Generate Invoice
            </button>
          </div>
        </div> */}
      </div>

      <DataTable table={table} />
    </div>
  );
}
