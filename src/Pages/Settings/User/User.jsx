import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "../../../Components/Common/DataTable";
import { useEffect, useMemo, useState } from "react";
import TextInput from "../../../Components/Common/TextInput";
import SelectInput from "../../../Components/Common/SelectInput";
import PrimaryButton from "../../../Components/Common/PrimaryButton";
import Header from "../../../Components/Common/Header";
import toast from "react-hot-toast";
import { addUser, deleteUser, getUsers } from "../../../api/user";
import { RxCross2 } from "react-icons/rx";
import ConfirmDeleteModal from "../../../Components/Common/DeleteModal";
import { getRoles } from "../../../api/role";

const User = () => {
  const [data, setData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const getUser = async () => {
    const data = await getUsers();
    // console.log(data?.usersData);
    setData(data?.usersData);
  };

  const RolesData = async () => {
    const data = await getRoles();
    // console.log(data?.data);
    setRoleData(data?.data);
  };

  useEffect(() => {
    RolesData();
    getUser();
  }, []);

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (id) => {
    // console.log(id);
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteDoctor = async () => {
    const data = await deleteUser(deleteId);
    if (data?.success) {
      toast.success("User Deleted Successfully");
      getUser();
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
         cell: (info) => {
          const expenseHeadId = info?.row?.original?.role;
          const matchedHead = roleData?.find(
            (head) => String(head?.id) === String(expenseHeadId)
          );

          return `${matchedHead?.role ?? ""}`;

        },
        header: "Role",
      },

      {
        accessorKey: "department",
        header: "Department",
      },
      {
        accessorKey: "designation",
        header: "Designation",
      },

      {
        accessorKey: "actions",
        header: "Actions",

        cell: ({ row }) => (
          <div className="flex gap-3">
            {/* <Link to={`invoice/${row.id}`}> */}
            {/* <Link to="/invoice/p"> */}
            <button onClick={() => handleDelete(row?.original?.id)}>
              <RxCross2 className="cursor-pointer text-sm ml-3 text-red-600" />
            </button>
            {/* </Link> */}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    // onRowSelectionChange: handleRowClick(),
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const phone_no = form.phone_no.value;
    const role = form.role.value;
    const department = form.department.value;
    const designation = form.designation.value;
    const email = form.email.value;
    const user_name = form.user_name.value;
    const password = form.password.value;

    const obj = {
      name,
      phone_no,
      role,
      department,
      designation,
      email,
      user_name,
      password,
    };
    // console.log(obj);

    const result = await addUser(obj);
    if (result && result.success) {
      toast.success(result?.message);
      getUser();
    } else {
      toast.error(result?.message);
    }
  };

  return (
    <div className="h-[90vh] overflow-y-auto bg-white rounded-3xl px-6 pt-5 pb-4">
      <Header
        title="User Settings"
        // subtitle="You can onboard customers, see their info and status"
      />

      <div className="flex gap-10 mt-6">
        <div className="h-auto border-r w-3/12 pr-8 flex flex-col justify-between">
          <form onSubmit={handleAddUser} className="flex flex-col gap-4">
            
            <TextInput
              label="Name"
              required
              placeholder="Write name here...."
              type="text"
              name="name"
            />
            <TextInput
              label="Phone"
              required
              placeholder="Write phone no"
              type="tel"
              name="phone_no"
            />

            <SelectInput
              label="Department"
              name="department"
              options={[
                { label: "Merchandise", value: "Merchandise" },
                { label: "IT", value: "IT" },
                { label: "Accounts", value: "Accounts" },
                { label: "Admin", value: "Admin" },
                { label: "Cutting", value: "Cutting" },
                { label: "Fabric Store", value: "Fabric Store" },
                { label: "Accessories Store", value: "Accessories Store" },
                { label: "Maintenance", value: "Maintenance" },
                { label: "Commercial", value: "Commercial" },
                { label: "Production", value: "Production" },
                { label: "Managing Director", value: "Managing Director" },
              ]}
            />

            <SelectInput
              label="Designation"
              name="designation"
              options={[
                { label: "Managing Director", value: "Managing Director" },
                { label: "Manager", value: "Manager" },
                { label: "Executive", value: "Executive" },
                { label: "Issuer", value: "Issuer" },
              ]}
            />
            <SelectInput
              label="Role"
              name="role"
              options={roleData?.map((i) => ({
                key: i?.id,
                label: i?.role,
              }))}
            />

            <TextInput label="Email" type="email" name="email" />

            <TextInput
              label="User Name"
              type="text"
              name="user_name"
              placeholder="Write section here"
            />
            <TextInput
              label="Password"
              type="password"
              name="password"
              placeholder="Write section here"
            />

            <PrimaryButton
              text="Add User"
              className="text-xs font-medium  py-[2px] mt-3 h-[35px]"
            />
          </form>
        </div>

        <div className="flex-1">
          <h2 className="font-bold text-xs text-[#3B3B3B] ml-3 mb-3">
            User List
          </h2>
          <div className="w-full">
            <DataTable table={table} />
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        onConfirm={handleDeleteDoctor}
      />
    </div>
  );
};

export default User;
