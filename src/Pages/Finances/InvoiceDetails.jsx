import { useParams } from "react-router-dom";
import { transactionLogs, clinicians } from "../../Components/utils/Data";

export default function InvoiceDetails() {
  const { invoiceId } = useParams();
  const invoice = transactionLogs.find(
    (inv) => inv.invoice === Number(invoiceId)
  );

  const invoiceDate = new Date(invoice.date);
  const monthYear = invoiceDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  if (!invoice) return <p className="text-red-500">Invoice not found</p>;

  const clinician = clinicians.find((c) => c.name === invoice.clinician);

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-primary mb-1">
          Monthly Invoice {monthYear}
        </h2>
        <p className="text-secondary text-xs mb-4">
          Review your completed assessments and payment details for this month
        </p>

        <div className="border rounded-lg p-6 w-[75vw]">
          {/* Clinician Details */}
          {clinician && (
            <div className="flex flex-col items-start gap-1">

              <h3 className="text-lg font-semibold ">
                {clinician.name}</h3>
               
                  <span className="text-sm text-gray-500">
                    {clinician.specialties}
                  </span>
                
              

              <p className="text-gray-500 text-sm mb-1">
        
                {clinician.email && <span> {clinician.email}</span>}
              </p>
            </div>
          )}
        </div>

        <p className="text-gray-500 mb-6">Invoice #{invoiceId}</p>
        <p>
          <strong>Date:</strong> {invoice.date}
        </p>
        <p>
          <strong>Clinician:</strong> {invoice.clinician}
        </p>
        <p>
          <strong>Total Amount:</strong> ${invoice.amount}
        </p>
        <p>
          <strong>Clinician Share:</strong> ${invoice.clinicianShare}
        </p>
        <p>
          <strong>Platform Share:</strong> ${invoice.platformShare}
        </p>
      </div>
    </section>
  );
}
