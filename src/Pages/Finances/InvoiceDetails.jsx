import { useParams } from "react-router-dom";
import { transactionLogs, clinicians } from "../../Components/utils/Data";
import p1 from "../../../public/png/invoiceid.png";
import p2 from "../../../public/png/date.png";
import DataTable from "../../Components/Common/DataTable";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useMemo } from "react";

export default function InvoiceDetails() {
  const { invoiceId } = useParams();
  const invoice = transactionLogs.find(
    (inv) => inv.invoice === Number(invoiceId)
  );

  const invoiceAssessments = useMemo(
    () => [
      {
        id: 1,
        patientName: "John Doe",
        date: "2023-05-15",
        assessmentName: "Depression Screening",
        amount: 120,
      },
      {
        id: 2,
        patientName: "Jane Smith",
        date: "2023-05-18",
        assessmentName: "Anxiety Evaluation",
        amount: 150,
      },
      {
        id: 3,
        patientName: "Robert Johnson",
        date: "2023-05-22",
        assessmentName: "ADHD Assessment",
        amount: 200,
      },
    ],
    []
  );

  const totalAmount = invoiceAssessments.reduce(
    (sum, assessment) => sum + assessment.amount,
    0
  );

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
      cell: (info) => `$${info.getValue()}`,
    },
  ];

  const assessmentTable = useReactTable({
    data: invoiceAssessments,
    columns: assessmentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const invoiceDate = new Date(invoice.date);
  const monthYear = invoiceDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  if (!invoice) return <p className="text-red-500">Invoice not found</p>;

  const clinician = clinicians.find((c) => c.name === invoice.clinician);
  return (
     <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
        <h2 className="text-xl font-semibold text-primary mb-1">
          Monthly Invoice {monthYear}
        </h2>
        <p className="text-secondary text-xs mb-4">
          Review your completed assessments and payment details for this month
        </p>

        <div className="border rounded-lg  w-[60vw] flex  justify-center items-center ">
          {/* Clinician Details */}
          <div className="border-r-2 p-6 w-1/2">
            {clinician && (
              <div className="flex flex-col items-start gap-1">
                <h3 className="text-lg font-semibold ">{clinician.name}</h3>
                <span className="text-sm text-gray-500">
                  {clinician.specialties}
                </span>
                <p className="text-gray-500 text-sm mb-1">
                  <span> {clinician.email}</span>
                </p>
              </div>
            )}
          </div>

          <div className="p-6 w-1/2 ">
            <div className="flex gap-4 items-start justify-start">
              <p className="text-gray-500 mb-2 flex gap-2 items-center">
                <img src={p1} className="w-5 h-5" /> #{invoiceId}{" "}
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

        {/* <div className="text-sm flex flex-col gap-3 mt-4">
          <p>
            <strong>Total Amount</strong> ${invoice.amount}
          </p>
          <p>
            <strong>Clinician Share</strong> ${invoice.clinicianShare}
          </p>
          <p>
            <strong>Platform Share</strong> ${invoice.platformShare}
          </p>
        </div> */}

        <div className="mt-10 ">
          <h2 className="text-sm font-semibold mb-4">Assessment Summary</h2>

          <DataTable table={assessmentTable} />

          <div className="border-t flex justify-end mt-4 text-sm pr-[13%]">
            <div className=" pt-2 w-1/6 ">
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-semibold">${totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
