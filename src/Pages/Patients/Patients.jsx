import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import Pagination from "../../Components/Common/Pagination";
import { IoEye } from "react-icons/io5";
import { HiOutlineSearch } from "react-icons/hi";
import { MdOutlineFilterList } from "react-icons/md";
import { getUsers } from "../../api/user";

const PatientPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const limit = 30;

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(page, limit);
      const filteredUsers = (data.payload || []).filter(
        (user) => user.role !== "admin" && user.role !== "clinician",
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Derive unique roles from fetched users dynamically
  const roles = useMemo(() => {
    const unique = [...new Set(users.map((u) => u.role).filter(Boolean))];
    return ["All", ...unique];
  }, [users]);

  // Client-side search + filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q);
      const matchesRole = selectedRole === "All" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

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
      header: "Joined",
      accessorKey: "createdAt",
      cell: (info) => {
        const date = info.row.original.createdAt;
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
      },
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (info) => {
        const role = info.row.original.role;
        if (!role) return "N/A";
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 capitalize">
            {role}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => navigate(`/patients/${row.original.id}`)}
          className="text-primary ml-4 hover:opacity-70 transition-opacity"
          aria-label={`View profile of ${row.original.name}`}
        >
          <IoEye size={16} />
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
  });

  if (loading) {
    return (
      <section className="h-[90vh] flex flex-col justify-center items-center">
        <div className="custom-loader"></div>
        <p className="mt-4 text-sm text-gray-500">Loading users ...</p>
      </section>
    );
  }

  return (
    <section>
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="font-semibold text-xl text-gray-800">Users</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Manage and view all registered platform users.
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex  items-end justify-end  gap-2 -mt-12 mb-3 ">
        {/* Search */}
        <div className="relative  w-52">
          <HiOutlineSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-md bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <MdOutlineFilterList
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPage(1);
            }}
            className="pl-7 pr-3 py-2 text-xs border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition appearance-none cursor-pointer"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === "All"
                  ? "All Roles"
                  : role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {/* <span className="text-xs text-gray-400 ml-auto">
          {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}
        </span> */}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden w-[79vw]">
        <div className="overflow-x-auto h-[72vh] overflow-y-auto">
          <DataTable table={table} emptyMessage="No users found." />
        </div>
  </div>
        {/* Pagination, at the bottom */}
        <Pagination
          page={page}
          onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setPage((prev) => (users.length < limit ? prev : prev + 1))
          }
          hasNextPage={users.length >= limit}
        />
    
    </section>
  );
};

export default PatientPage;