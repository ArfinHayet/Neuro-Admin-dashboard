
import { transactionLogs } from "../../Components/utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import toast from "react-hot-toast";

export default function TransactionLogs() {
  const transactions = transactionLogs;

    const handleDownloadInvoice = (invoiceId) => {
    toast.success(`Downloading invoice #${invoiceId}`);
  };

  const columns = [
   {
      accessorKey: "date",
      header: "Date",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "clinician",  // fixed from "name"
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
      accessorKey: "invoice",
      header: "Invoice",
      cell: ({ row }) => (
        <button
          className="text-primary underline"
          onClick={() => handleDownloadInvoice(row.original.invoice)}
        >
          Download
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1 text-primary">Transaction Logs</h2>
      <p className="mb-6 text-sm text-secondary">Track earnings, commission splits, and download invoices</p>
        <DataTable table={table} />
    </div>
  );
}
