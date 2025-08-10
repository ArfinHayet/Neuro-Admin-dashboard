import { flexRender } from "@tanstack/react-table";

const DataTable = ({ table }) => {
  return (
    <table className="table-auto  w-full">

      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-4 border-t text-sm font-medium text-[#333333] py-2 text-left"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="px-4 py-3 text-xs font-normal text-[#6C6C6C]"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>



  );
};

export default DataTable;
