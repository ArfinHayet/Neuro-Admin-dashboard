import { useState } from "react";
import { transactionLogs, clinicians } from "../../Components/utils/Data"; // clinicians list added
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import toast from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";


export default function TransactionLogs() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [invoices, setInvoices] = useState(transactionLogs);
  const [selectedClinician, setSelectedClinician] = useState("");

  const handleGenerateInvoice = () => {
    if (!selectedClinician) {
      toast.error("Please select a clinician");
      return;
    }

    const newInvoice = {
      id: invoices.length + 1,
      date: new Date().toISOString().slice(0, 10),
      clinician: selectedClinician,
      amount: Math.floor(Math.random() * 500 + 100), // using demo amount
      clinicianShare: Math.floor(Math.random() * 300 + 50),
      platformShare: Math.floor(Math.random() * 100 + 20),
      invoice: invoices.length + 1,
    };

    setInvoices((prev) => [...prev, newInvoice]);
    toast.success(`Invoice generated for ${selectedClinician}`);
    setSelectedClinician(""); 
  };

  const handleDownloadInvoice = (invoiceId) => {
    toast.success(`Downloading invoice #${invoiceId}`);
  };

  const handleViewInvoice = (invoiceId) => {
    const invoice = invoices.find((inv) => inv.invoice === invoiceId);
    if (invoice) {
      toast(`Viewing invoice #${invoiceId} for ${invoice.clinician}`, );
    }
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
    { accessorKey: "date", header: "Date", cell: (info) => info.getValue() },
    {
      accessorKey: "clinician",
      header: "Clinician",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "amount",
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
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-3">
         
          <button
            className="text-secondary "
            onClick={() => handleViewInvoice(row.original.invoice)}
          >
            <IoEye  size={16}/>
          </button>
          <button
            className="text-secondary "
            onClick={() => handleDownloadInvoice(row.original.invoice)}
          >
            <IoMdDownload  size={16}/>
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
          <h2 className="text-lg font-semibold text-primary">
            Transaction Logs
          </h2>
          <p className="mb-6 text-sm text-secondary">
            Track earnings, commission splits, and manage invoices
          </p>
        </div>
       
    <div className="flex justify-between mb-4">
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
      <div className="flex gap-6 items-center">

        {/* invoice Generate */}
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
      </div>
      </div>  

      <DataTable table={table} />
    </div>
  );
}
