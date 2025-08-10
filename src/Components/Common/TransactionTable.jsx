import { flexRender } from "@tanstack/react-table";

const TransactionTable = ({ table,opening }) => {
    return (
        <table className="table-auto w-full">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b">
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className="px-4 border-t text-xs font-medium text-[#333333] py-2 text-left"
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


            <tbody>
                <tr>

                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="py-2 px-4 text-xs font-normal text-[#6C6C6C]">Opening Balance</td>
                    <td></td>
                    <td></td>
                    {/* <p className="px-4 py-2 text-xs text-center  font-normal text-[#6C6C6C]">Opening Balance:{opening}</p> */}
                    <td className="px-4 py-2 text-xs font-normal text-[#6C6C6C]">{opening}</td>

                </tr>


                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                            <td
                                key={cell.id}
                                className="px-4 py-3 border-t-2 text-xs font-normal text-[#6C6C6C]"
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

export default TransactionTable;
