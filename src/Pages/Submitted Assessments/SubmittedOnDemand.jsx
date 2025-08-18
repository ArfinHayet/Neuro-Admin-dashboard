import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  users,
  children,
  categories,
} from "../../Components/utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getSubmissions } from "../../api/submissionanswers";


const SubmittedOnDemand = () => {
  const navigate = useNavigate();
   const [submissions, setSubmissions] = useState([]);
  
    const fetchSubmissions = async () => {
        try {
          const data = await getSubmissions();
          const initialSubmissions = (data || []).filter(
            (item) => item.assessmentType === "on-demand"
          );
          setSubmissions(initialSubmissions);
        } catch (err) {
          console.error("Failed to fetch submissions:", err);
          setSubmissions([]);
        } 
      };
      useEffect(() => {
        fetchSubmissions();
      }, []);


  const onView = (id) => {
    navigate(`/submitted-assessments/on-demand/${id}`);
  };

  const columns = [
    {
      header: "User Name",
      accessorKey: "userId",
      cell: ({ getValue }) => {
        const user = users.find((u) => u.id === getValue());
        return user ? user.name : "Unknown User";
      },
    },
    {
      header: "Child Name",
      accessorKey: "patientId",
      cell: ({ getValue }) => {
        const child = children.find((c) => c.id === getValue());
        return child ? child.name : "-";
      },
    },
    {
      header: "Date Taken",
      accessorKey: "dateTaken",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("en-GB"),
    },
    {
      header: "Assessment Category",
      accessorKey: "categoryId",
      cell: ({ getValue }) => {
        const category = categories.find((cat) => cat.id === getValue());
        return category ? category.title : "Unknown Category";
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <button onClick={() => onView(row.original.id)} className="px-2">
          <IoEye size={18} />
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: submissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <h1 className="text-xl font-medium ">
          Submitted On-Demand Assessments
        </h1>
        <p className="text-sm mb-6 text-secondary">
          Access and Review Detailed Records of Every Submitted Assessment.{" "}
        </p>

        <p className="mb-2 ">Total submitted: {submissions?.length}</p>

        <div className="bg-white rounded border border-opacity-30 ">
          <DataTable table={table} />
        </div>
      </div>
    </section>
  );
};
export default SubmittedOnDemand;
