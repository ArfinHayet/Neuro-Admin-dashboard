/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getSingleRole, updateRolePrivilege } from "../../../api/role";
// import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { StringToArray } from "../../../Components/utils/StringToArray";
import { navItem } from "../../../Components/utils/navItem";

const PRIVILEGE_TYPES = ["add", "view", "edit", "delete"];

const featuresArr = navItem.flatMap((section) =>
  section.routes.map((priv) => priv?.path?.replace(/^\/|\/$/g, ""))
);
// console.log(featuresArr);

const totalFeatures = featuresArr.length;
// console.log(totalFeatures);

const AddPrivilege = () => {
  const [privileges, setPrivileges] = useState({
    add: [],
    view: [],
    edit: [],
    delete: [],
  });
  const [roleInfo, setRoleInfo] = useState(null);
  const [selectAll, setSelectAll] = useState({
    add: false,
    view: false,
    edit: false,
    delete: false,
  });
  const [isChecked, setIsChecked] = useState(false);

  const { id } = useParams();
  // console.log(id);

  const getRoleDetails = async () => {
    const { data } = await getSingleRole(id);
    // console.log(data);
    const role = data?.role;
    // console.log(role);
    if (role) {
      setRoleInfo(role);

      const parsedPrivileges = {
        add: StringToArray(data.add_privilege),
        view: StringToArray(data.view_privilege),
        edit: StringToArray(data.update_privilege),
        delete: StringToArray(data.delete_privilege),
      };
      // console.log("parsed", parsedPrivileges);

      setPrivileges(parsedPrivileges);
      // console.log("parsed", privileges);

      setSelectAll({
        add: parsedPrivileges.add.length === totalFeatures,
        view: parsedPrivileges.view.length === totalFeatures,
        edit: parsedPrivileges.edit.length === totalFeatures,
        delete: parsedPrivileges.delete.length === totalFeatures,
      });
      // console.log(selectAll);
    }
  };

  useEffect(() => {
    getRoleDetails();
  }, [id]);

  const handleChange = (type, value, checked) => {
    // console.log(type);
    const updated = checked
      ? [...privileges[type], value]
      : privileges[type].filter((item) => item !== value);

    // console.log(updated);

    setPrivileges((prev) => ({
      ...prev,
      [type]: updated,
    }));

    setSelectAll((prev) => ({
      ...prev,
      [type]: updated.length === totalFeatures,
    }));
  };

  const handleSelectAll = (type) => {
    const newSelected = selectAll[type] ? [] : [...featuresArr];

    setPrivileges((prev) => ({
      ...prev,
      [type]: newSelected,
    }));
    setSelectAll((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleUpdatePrivilege = async () => {
    const updatedRole = {
      role: roleInfo,
      add_privilege: privileges.add.join(","),
      view_privilege: privileges.view.join(","),
      update_privilege: privileges.edit.join(","),
      delete_privilege: privileges.delete.join(","),
    };

    // console.log(updatedRole);
    const result = await updateRolePrivilege(updatedRole);
    if (result?.success) {
      toast.success("Privileges updated successfully");
      getRoleDetails();
    } else {
      toast.error(result.message);
    }
  };

  return (
        <div className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-5">
      <div className="ml-4 mb-5 pb-5">
        <p className="text-lg font-semibold">Edit Privilege</p>
        <p className="text-xs font-normal text-gray-600">
          It gives the right to make changes to, add to, or delete from a
          document or other content.
        </p>
      </div>

      <div className="px-1 pt-2">
        <table className="table w-full">
          <thead>
            <tr className="text-[#3B3B3B] border-b border-b-[#E0E0E0] text-xs font-bold">
              <th>Main Section</th>
              <th>Feature</th>
              <th>
                <div className="flex flex-row gap-10">
                  {PRIVILEGE_TYPES.map((type) => (
                    <div
                      key={type}
                      className="flex flex-row gap-[2px] items-center"
                    >
                      <input
                        id={`all-${type}`}
                        className="accent-[#0A6876] focus:accent-[#0A6876]"
                        type="checkbox"
                        checked={selectAll[type]}
                        onChange={() => handleSelectAll(type)}
                      />
                      <label
                        htmlFor={`all-${type}`}
                        className="capitalize cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {navItem.flatMap((section) =>
              section.routes.map((privilege, index) => (
                <tr
                  key={`${section.title}-${privilege.path.replace(
                    /^\/|\/$/g,
                    ""
                  )}`}
                >
                  {index === 0 && (
                    <th rowSpan={section.routes.length} scope="row">
                      {section.title}
                    </th>
                  )}
                  <td className="text-sm">{privilege.label}</td>
                  <td>
                    <div className="flex gap-10">
                      {PRIVILEGE_TYPES.map((type) => (
                        <label
                          key={type}
                          htmlFor={`${type}-${privilege.path.replace(
                            /^\/|\/$/g,
                            ""
                          )}`}
                          className="flex items-center gap-1 text-xs cursor-pointer capitalize"
                        >
                          <input
                            id={`${type}-${privilege.path.replace(
                              /^\/|\/$/g,
                              ""
                            )}`}
                            type="checkbox"
                            className="accent-[#0A6876]"
                            checked={privileges[type].includes(
                              privilege.path.replace(/^\/|\/$/g, "")
                            )}
                            onChange={(e) =>
                              handleChange(
                                type,
                                privilege.path.replace(/^\/|\/$/g, ""),
                                e.target.checked
                              )
                            }
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex flex-row justify-between mt-[60px] w-8/12">
          <div>
            <input
              className="mt-1 mr-1"
              id="confirmState"
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <label
              className="text-xs font-normal text-[#3B3B3B]"
              htmlFor="confirmState"
            >
              Are you sure to update?
            </label>
          </div>

          <button
            disabled={!isChecked}
            onClick={handleUpdatePrivilege}
            className={`btn min-h-0 w-4/12 h-[32px] px-20 text-xs font-semibold text-white bg-[#0A6876] hover:bg-[#0A6876] ${
              !isChecked ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPrivilege;
