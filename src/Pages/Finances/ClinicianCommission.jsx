import { useState } from "react";
import { defaultCommissionRate , clinicianList } from "../../Components/utils/Data";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import toast from "react-hot-toast";

export default function ClinicianCommission() {
  const [defaultCommission, setDefaultCommission] = useState(defaultCommissionRate);
  const [clinicians, setClinicians] = useState(clinicianList);

  const updateCommission = (id, value) => {
    setClinicians(prev =>
      prev.map(cl => (cl.id === id ? { ...cl, commission: value } : cl))
    );
  };

   const handleSaveChanges = () => {
    console.log("Updated categories:", clinicians);
    toast.success("Changes saved successfully!");
  };

   const columns = [
     {
       accessorKey: "name",
       header: "Clinicians list",
       cell: (info) => info.getValue(),
     },
     {
       accessorKey: "Commission",
       header: "Commission (%)",
       cell: ({ row }) => (
         <input
           type="number"
           className="border rounded p-1 w-16 text-sm text-center"
           value={row.original.commission}
           onChange={(e) => updateCommission(row.original.id, e.target.value)}
           min={0}
           max={100}
         />
       ),
     },
   ];

  const table = useReactTable({
    data: clinicians,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


  return (
    <div>
      <h2 className="text-lg font-semibold mb-1 text-primary">Clinician Commissions</h2>
      <p className="text-sm mb-6 text-secondary">Manage default and custom commission rates for clinicians.</p>

      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Global Default Commission (%)
        </label>
        <input
          type="number"
          value={defaultCommission}
          onChange={e => setDefaultCommission(e.target.value)}
          className="border-2 rounded px-3 py-2 w-20 text-center"
        />
      </div>

      <h3 className="font-medium mb-2">Custom Rates</h3>
     <DataTable table={table} />

     <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="px-4 py-2 text-sm bg-primary text-white rounded-full"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
