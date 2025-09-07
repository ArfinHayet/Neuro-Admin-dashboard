import { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { useNavigate } from "react-router-dom";
import { getPayments } from "../../api/payment";
import { IoEye } from "react-icons/io5";


const PurchaseHistory = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const data = await getPayments();
      setPurchases(data.payload || []);
    };
    fetchPayments();
  }, []);

  const columns = [
    { 
      accessorKey: "customerEmail", 
      header: "User Email" 
    },
    {

       accessorKey: "amount", 
       header: "Amount", 
       cell: ({ row }) => `$${row.original.amount} ${row.original.currency}` 
      },
    { 
      accessorKey: "paymentStatus", 
      header: "Status" 
    },
    { 
      accessorKey: "createdAt", 
      header: "Date", 
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString() 
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
      <div className="text-left">
       <button
          className="text-primary text-lg ml-3"
          onClick={() => navigate(`/finances/payments/${row.original.id}`)}
        >
          <IoEye />
        </button>   
      </div>
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
      <h2 className="text-lg font-semibold text-primary mb-2">Payment History</h2>
      <p className="text-xs text-secondary mb-6">
        View all payments made by users for assessments.
      </p>
      <DataTable table={table} />
    </section>
  );
};

export default PurchaseHistory;
