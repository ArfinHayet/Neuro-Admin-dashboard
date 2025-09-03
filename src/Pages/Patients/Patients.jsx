import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { IoEye } from "react-icons/io5";
import { getUsers } from "../../api/user";
import { IoIosArrowBack, IoIosArrowForward  } from "react-icons/io";

const PatientPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 30; 

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(page, limit);
      console.log("users", data);
      const filteredUsers = (data.payload || []).filter(
        (user) => user.role !== "admin"
      );

      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => info.row.original.name || "N/A",
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (info) => info.row.original.email || "N/A",
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (info) => info.row.original.phone || "N/A",
    },
    {
      header: "Country",
      accessorKey: "country",
      cell: (info) => info.row.original.country || "N/A",
    },
    {
      header: "Age",
      accessorKey: "age",
      cell: (info) => info.row.original.age || "N/A",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (info) => info.row.original.role || "N/A",
    },
    // {
    //   header: "Status",
    //   accessorKey: "isBlocked",
    //   cell: ({ getValue }) =>
    //     getValue() ? (
    //       <span className="px-2 text-xs  inline-flex leading-5 rounded-full bg-red-100 text-red-800">
    //         Blocked
    //       </span>
    //     ) : (
    //       <span className="px-2 text-xs  inline-flex leading-5 rounded-full bg-green-100 text-green-800">
    //         Active
    //       </span>
    //     ),
    // },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-left">
          <button
            onClick={() => navigate(`/patients/${row.original.id}`)} //if backend => id
            className="text-primary  text-lg ml-3"
            aria-label={`View profile of ${row.original.name}`}
          >
            <IoEye />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
  });

  return (
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
      <h1 className="font-semibold text-xl ">Users List</h1>
      <p className="text-secondary text-sm mb-4">
        Manage and view all registered platform users.
      </p>
      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          Loading users...
        </div>
      ) : (
       <> <div className="p-2 w-[80vw] bg-white rounded-xl overflow-x-auto">
          <DataTable table={table} />
        </div>

     
       <div className=" absolute flex justify-end items-center gap-2 right-8 bottom-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              <IoIosArrowBack size={18} />
            </button>

            <span className="text-sm p-2 ">
              Page {page}
            </span>

            <button
              onClick={() => setPage((prev) => (users.length < limit ? prev : prev + 1))}
              disabled={users.length < limit}
              className="py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              <IoIosArrowForward size={18}/>
            </button>
          </div> 
        </>
      )}
    </section>
  );
};

export default PatientPage;
