// import { flexRender } from "@tanstack/react-table";

// const DashboardDatatable = ({ table }) => {
//   return (
//     <div className="rounded-md h-[50vh]">
//       <table className="table-auto w-full">
//         <thead className="sticky top-0 z-10 text-left">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id} className="border-b">
//               {headerGroup.headers.map((header) => (
//                 <th
//                   key={header.id}
//                   className="px-4 text-sm font-medium text-[#333333] py-2 text-left"
//                 >
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext()
//                   )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//       </table>

//       <div className="overflow-auto max-h-[45vh]">
//         <table className="table-auto w-full">
//           <tbody className="divide-y text-center items-center">
//             {table.getRowModel().rows.map((row) => (
//               <tr key={row.id} className="hover:bg-gray-50 px-4">
//                 {row.getVisibleCells().map((cell) => (
//                   <td
//                     key={cell.id}
//                     className="px-2 text-xs font-medium text-[#6C6C6C] py-2 text-left"
//                   >
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DashboardDatatable;









import { flexRender } from "@tanstack/react-table";

const DashboardDatatable = ({ table }) => {
  return (
    <div className="rounded-md h-[50vh] overflow-auto">
      <table className="table-auto w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-white text-left">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 text-sm font-medium text-[#333333] py-2 text-left bg-white"
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
                  className="px-4 text-xs font-medium text-[#6C6C6C] py-2 text-left"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardDatatable;
