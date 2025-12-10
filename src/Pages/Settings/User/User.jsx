import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "../../../Components/Common/DataTable";
import { useEffect, useMemo, useState } from "react";
import TextInput from "../../../Components/Common/TextInput";
import SelectInput from "../../../Components/Common/SelectInput";
import PrimaryButton from "../../../Components/Common/PrimaryButton";
import Header from "../../../Components/Common/Header";
import toast from "react-hot-toast";
import { addUser, deleteUser, getUsers, getUserById } from "../../../api/user";
import { RxCross2 } from "react-icons/rx";
import ConfirmDeleteModal from "../../../Components/Common/DeleteModal";

const roles = ["Admin"];

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 30;
  const [data, setData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(page, limit);

      const filteredUsers = (data.payload || []).filter(
        (user) => user.role === "admin"
      );

      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteDoctor = async () => {
    const data = await deleteUser(deleteId);
    if (data?.success) {
      toast.success("User Deleted Successfully");
      fetchUsers();
      setIsDeleteModalOpen(false);
    } else {
      toast.error("Failed to delete");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        cell: (info) => info.row.index + 1,
      },
      {
        accessorKey: "user_id",
        header: "User_Id",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => info?.row?.original?.role || "",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const role = form.role.value;
   

    const obj = { name, phone, email, role };

    const result = await addUser(obj);
    if (result && result.success) {
      toast.success(result?.message);
      fetchUsers();
    } else {
      console.error(result?.message);
    }
  };

  return (
    <section className="">
      {" "}
      <h1 className="font-semibold text-xl ">User Settings</h1>
      {/* <Header className="font-bold text-xl " title="User Settings" /> */}
      <div className="flex gap-10 mt-6">
        {/* Left Form */}
        <div className="h-auto border-r w-3/12 pr-8 flex flex-col justify-between">
          <form onSubmit={handleAddUser} className="flex flex-col gap-2">
            <SelectInput
              label="Name"
              required
              name="name"
              options={users?.map((i) => ({
                key: i?.id,
                label: i?.name,
                value: i?.name,
              }))}
              placeholder="Select a user"
            />

            <TextInput
              label="Phone"
              required
              placeholder="phone no"
              type="tel"
              name="phone"
            />

            <TextInput
              label="Email"
              type="email"
              name="email"
              placeholder="Write email"
            />

            <SelectInput
              label="Role"
              name="role"
              options={roles.map((role, idx) => ({
                key: idx,
                label: role,
                value: role,
              }))}
              placeholder="Select a role"
            />

            <PrimaryButton
              text="Add User"
              className="text-xs font-medium py-[2px] mt-3 h-[35px]"
            />
          </form>
        </div>

        {/* Right Table */}
        <div className="flex-1">
          <h2 className="font-bold text-xs text-[#3B3B3B] ml-3 mb-3">
            User List
          </h2>
          <div className="w-full">
            <DataTable table={table} />
          </div>
        </div>
      </div>
      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        onConfirm={handleDeleteDoctor}
      />
    </section>
  );
};

export default User;
