import { useState } from "react";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { assessmentCategories } from "../../Components/utils/Data";
import DataTable from "../../Components/Common/DataTable";
import toast from "react-hot-toast";


const AssessmentPricing = () => {
   const [categories, setCategories] = useState(assessmentCategories);

  const handleToggleEnabled = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  };

  const handlePriceChange = (id, newPrice) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, price: Number(newPrice) } : cat
      )
    );
  };

  const handleSaveChanges = () => {
    console.log("Updated categories:", categories);
    toast.success("Changes saved successfully!");
  };

 const columns = [
    {
      accessorKey: "name",
      header: "Assessment Category",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "price",
      header: "Price (£)",
      cell: ({ row }) => (
        <input
          type="number"
          className="border rounded p-1 w-16 text-sm text-center"
          value={row.original.price}
          onChange={(e) =>
            handlePriceChange(row.original.id, e.target.value)
          }
        />
      ),
    },
    {
      accessorKey: "enabled",
      header: "Enabled",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.original.enabled}
          onChange={() => handleToggleEnabled(row.original.id)}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="bg-white ">
      <h2 className="text-lg font-semibold mb-1 text-primary">Assessment Pricing</h2>
      <p className="text-sm text-gray-600 mb-6">
        Set the price per category and toggle categories for On-Demand Assessments.
      </p>

        <DataTable table={table} />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="px-4 py-2 text-sm bg-primary text-white rounded-full"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
};

export default AssessmentPricing;