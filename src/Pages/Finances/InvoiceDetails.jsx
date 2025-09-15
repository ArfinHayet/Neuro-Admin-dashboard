import { useParams, useLocation } from "react-router-dom";
import DataTable from "../../Components/Common/DataTable";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useMemo } from "react";
import p1 from "../../../public/png/invoiceid.png";
import p2 from "../../../public/png/date.png";

export default function InvoiceDetails() {
  const { invoiceId } = useParams();
  const location = useLocation();
  const invoice = location.state?.invoice;

  // Create assessment details from invoice submissions
  const invoiceAssessments = useMemo(() => {
    if (!invoice || !invoice.submissions) return [];
    
    return invoice.submissions.map((submission, index) => {
      const assessment = submission.assessment || {};
      const patient = submission.patient || {};
      
      return {
        id: index + 1,
        patientName: patient.name || "Unknown Patient",
        date: submission.createdAt ? new Date(submission.createdAt).toISOString().slice(0, 10) : "Unknown Date",
        assessmentName: assessment.name || "Unknown Assessment",
        amount: assessment.price ? parseFloat(assessment.price) : 0,
      };
    });
  }, [invoice]);

  const totalAmount = invoiceAssessments.reduce(
    (sum, assessment) => sum + assessment.amount,
    0
  );

  const clinicianShare = totalAmount * 0.2;
  const platformShare = totalAmount * 0.8;

  const assessmentColumns = [
    {
      accessorKey: "patientName",
      header: "Patient Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "assessmentName",
      header: "Assessment Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => `£${info.getValue().toFixed(2)}`,
    },
  ];

  const assessmentTable = useReactTable({
    data: invoiceAssessments,
    columns: assessmentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!invoice) return <p className="text-red-500">Invoice not found</p>;

  const invoiceDate = new Date(invoice.date);
  const monthYear = invoiceDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
     <section className=" ">
        <h2 className="text-xl font-semibold text-primary mb-1">
          Monthly Invoice {monthYear}
        </h2>
        <p className="text-secondary text-xs mb-4">
          Review your completed assessments and payment details for this month
        </p>

        <div className="border rounded-lg w-[60vw] flex justify-center items-center">
          {/* Clinician Details */}
          <div className="border-r-2 p-6 w-1/2">
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-lg font-semibold">{invoice.clinician}</h3>
              <p className="text-gray-500 text-sm mb-1">
                Clinician ID {invoice.clinicianId}
              </p>
            </div>
          </div>

          <div className="p-6 w-1/2">
            <div className="flex gap-4 items-start justify-start">
              <p className="text-gray-500 mb-2 flex gap-2 items-center">
                <img src={p1} className="w-5 h-5" /> #{invoiceId}
              </p>
              {invoice.status === "Paid" ? (
                <span className="bg-[#d5f2ae] text-[#578206] rounded-full text-xs px-3 py-1">
                  Paid
                </span>
              ) : (
                <span className="bg-[#EEF2AE] text-[#828006] rounded-full text-xs px-3 py-1">
                  Unpaid
                </span>
              )}
            </div>
            <p className="text-gray-500 mb-2 flex gap-2 items-center">
              <img src={p2} className="w-4 h-4" /> {invoice.date}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold mb-4">Assessment Summary</h2>

          <DataTable table={assessmentTable} />

          <div className="border-t flex justify-end mt-4 text-sm pr-[13%]">
            <div className="pt-2 w-1/6">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Total Amount</span>
                <span className="font-semibold">£{clinicianShare.toFixed(2)}</span>
              </div>
             
            </div>
          </div>
        </div>
    </section>
  );
}