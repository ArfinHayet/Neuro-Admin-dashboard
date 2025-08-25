import { useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";

const mockPurchases = [
  {
    id: 1,
    userName: "John Doe",
    userEmail: "john@example.com",
    patientName: "Emily Doe",
    assessmentName: "Autism Diagnostic Test",
    paymentIntentId: "pi_3Nv12345",
    amount: 5000, // Stripe stores in cents
    currency: "GBP",
    status: "succeeded",
    paymentMethod: "card",
    createdAt: "2025-08-20T12:45:00Z",
    receiptUrl: "https://pay.stripe.com/receipts/123",
  },
  {
    id: 2,
    userName: "Sarah Lee",
    userEmail: "sarah@example.com",
    patientName: "Michael Lee",
    assessmentName: "ADHD Screening",
    paymentIntentId: "pi_3Nv67890",
    amount: 3000,
    currency: "GBP",
    status: "succeeded",
    paymentMethod: "apple_pay",
    createdAt: "2025-08-22T15:30:00Z",
    receiptUrl: "https://pay.stripe.com/receipts/456",
  },
];

const PurchaseHistory = () => {
  const [purchases] = useState(mockPurchases);

  const columns = [
    { accessorKey: "userName", header: "User Name" },
    { accessorKey: "userEmail", header: "User Email" },
    { accessorKey: "patientName", header: "Patient Name" },
    { accessorKey: "assessmentName", header: "Assessment" },
    {
      accessorKey: "amount",
      header: "Amount Paid",
      cell: ({ row }) => `£${(row.original.amount / 100).toFixed(2)} ${row.original.currency}`,
    },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "paymentMethod", header: "Method" },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: "receiptUrl",
      header: "Receipt",
      cell: ({ row }) => (
        <a
          href={row.original.receiptUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          View
        </a>
      ),
    },
  ];

  const table = useReactTable({
    data: purchases,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="">
      <h2 className="text-lg font-semibold text-primary">Assessment Purchases History</h2>
      <p className="text-xs text-secondary mb-8">
        View which users purchased which assessments along with Stripe payment details.
      </p>

      <DataTable table={table} />
    </section>
  );
};

export default PurchaseHistory;
