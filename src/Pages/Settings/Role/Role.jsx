// eslint-disable no-unused-vars 
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "../../../Components/Common/DataTable";
import PrimaryButton from "../../../Components/Common/PrimaryButton";
import TextInput from "../../../Components/Common/TextInput";
import { useEffect, useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../../../Components/Common/Header";
import { addRole, deleteRole, getRoles } from "../../../api/role";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import ConfirmDeleteModal from "../../../Components/Common/DeleteModal";
import Permission from "../../../Components/Permission";

const Role = () => {
  const [data, setData] = useState([]);

  const RolesData = async () => {
    const data = await getRoles();
    // console.log(data?.data);
    setData(data?.data);
  };

  useEffect(() => {
    RolesData();
  }, []);

  const handleAddRole = async (e) => {
    e.preventDefault();
    const form = e.target;
    const role = form.role.value;

    if (!role) {
      toast.error("Please fill the Input field..");
    }
    const obj = {
      role: role,
    };
    console.log(obj);

    const result = await addRole(obj);
    if (result && result.success) {
      toast.success(result?.message);
      RolesData();
    } else {
      toast.error(result?.message);
    }
  };

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
    const data = await deleteRole(deleteId);
    // //console.log(data);

    if (data?.success) {
      toast.success("Role Deleted Successfully");
      RolesData();
      setIsDeleteModalOpen(false);
    } else {
      toast.error("Failed to delete");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "Id",
        cell: (info) => info.row.index + 1,
      },
      {
        accessorKey: "role",
        header: "Role",
      },

      {
        header: "Actions",
        // const rowData = info.row.original;
        cell: (info) => (
          <div className="flex gap-3">
            <Link to={`/addPrivilege/${info.row.original.id}`}>
              <button>
                <FaEdit className="cursor-pointer text-[#C7C7C7]" />
              </button>{" "}
            </Link>
            <button onClick={() => handleDelete(info.row.original.id)}>
              <RxCross2 className="cursor-pointer text-sm ml-3 text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="h-[90vh] overflow-y-auto bg-white rounded-3xl  px-6 pt-5">
      <Header
        title="Add Role"
        subtitle="You can onboard customers, see their info and status"
      />

      <div className="mt-6">
        <div className="flex flex-row">
          <div className="h-[464px] flex flex-col items-left w-3/12">
            <form onSubmit={handleAddRole} className="flex flex-col gap-2 ">
              <TextInput
                className="w-full"
                label="Role"
                // value={inputs.description}
                // onChange={handleChange}
                name="role"
                placeholder="Enter Role"
              />
              <div className="flex justify-end">
                 {/* <PrimaryButton
                  text="Add New Role"
                  className="text-sm w-3/5  font-medium px-12 py-[2px] mt-3 h-[35px]"
                />  */}

                <Permission
                  requiredPermissions={["role"]}
                  permissionType="add_privilege"
                >
                   <PrimaryButton
                  text="Add New Role"
                  className="text-sm w-3/5  font-medium px-12 py-[2px] mt-3 h-[35px]"
                />
                </Permission>
              </div>
            </form>
          </div>

          <div className="w-9/12">
            <div className="py-2 ml-7 border-l h-screen p-10">
              <div className="">
                <DataTable table={table} />
              </div>
            </div>
          </div>
        </div>

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          closeModal={closeDeleteModal}
          onConfirm={handleDeleteDoctor}
        />
      </div>
    </div>
  );
};

export default Role;
