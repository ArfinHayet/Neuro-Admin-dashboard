// import { flexRender } from "@tanstack/react-table";

// const DataTable = ({ table }) => {
//   return (
//     <table className="table-auto  w-full">
//       <thead>
//         {table.getHeaderGroups().map((headerGroup) => (
//           <tr key={headerGroup.id} className="border-b">
//             {headerGroup.headers.map((header) => (
//               <th
//                 key={header.id}
//                 className="px-3 text-sm font-medium text-[#333333] py-1 text-left bg-[#f3f1f1]"
//               >
//                 {flexRender(
//                   header.column.columnDef.header,
//                   header.getContext()
//                 )}
//               </th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody className="divide-y ">
//         {table.getRowModel().rows.map((row) => (
//           <tr key={row.id} className="hover:bg-gray-50">
//             {row.getVisibleCells().map((cell) => (
//               <td
//                 key={cell.id}
//                 className="px-3 py-1 text-xs font-normal text-[#525252] text-left"
//               >
//                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default DataTable;

import { flexRender } from "@tanstack/react-table";
import { HiOutlineInboxIn } from "react-icons/hi";

const DataTable = ({ table, emptyMessage = "No records found." }) => {
  const rows = table.getRowModel().rows;

  return (
    <div className="w-full overflow-x-auto">
      <table className="table-auto w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2.5 text-xs font-semibold text-[#4a4a4a] text-left bg-[#f7f6f6] border-b border-gray-200 whitespace-nowrap tracking-wide uppercase"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="py-16 text-center"
              >
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <HiOutlineInboxIn size={36} className="text-gray-300" />
                  <p className="text-sm font-medium">{emptyMessage}</p>
                  <p className="text-xs text-gray-400">
                    Try adjusting your search or filters.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[#fafafa] transition-colors duration-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 text-xs font-normal text-[#525252] text-left whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
