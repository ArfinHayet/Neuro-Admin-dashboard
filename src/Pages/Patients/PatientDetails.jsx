import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { users, children } from "../../Components/utils/Data";
import { childProfileFields } from "../../Components/utils/ChildPorfileConfig";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";

const PatientDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const user = users.find((u) => u.id === parseInt(userId));
  const userChildren = children.filter((child) => child.userId === user?.id);
  const [visibleChildren, setVisibleChildren] = useState(
    userChildren.map((child) => child.id)
  );

  if (!user) {
    return (
      <div className="p-6 ">
        <h2>User not found</h2>
        <button
          onClick={() => navigate("/patients")}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-full"
        >
          Back to User List
        </button>
      </div>
    );
  }

  const toggleChildVisibility = (childId) => {
    setVisibleChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  // console.log(user.image);

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 ">
      <h1 className="font-medium text-2xl mb-4">{user.name}'s Details</h1>

      <section className="mb-3 flex justify-between items-start ">
        <div>
          <h2 className=" font-medium mb-1">Login Information</h2>
          <p className="flex gap-2 items-center text-sm">
            <MdOutlineMailOutline size={18} /> {user.email}
          </p>
          <p className="flex gap-2 items-center text-sm">
            <LuPhone size={18} /> {user.phone}
          </p>
        </div>
        <img
          src={user.image}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </section>

      <section className="mb-3">
        <h2 className=" font-medium mb-1">Address</h2>
        <p className="flex gap-2 items-center text-sm">
          <FaRegAddressCard size={18} /> {user.street}, {user.state},{" "}
          {user.country}, {user.postCode}
        </p>
      </section>

      <section className="mb-3">
        <h2 className=" font-medium ">Personal Information</h2>
        <p className="text-sm">{user.name}</p>
        <p className="text-sm">{user.age} Year</p>
        <p className="text-sm">{user.role}</p>
        <p>
          {user.isBlocked ? (
            <span className="text-red-600 font-semibold text-sm">Blocked</span>
          ) : (
            <span className="text-green-600 font-semibold text-sm">Active</span>
          )}
        </p>
      </section>

      <section className="mb-3">
        <h2 className=" font-medium mb-2">Child Profiles</h2>

        {userChildren.length === 0 && (
          <p className="text-gray-600">No child profiles linked.</p>
        )}

        <div className="grid grid-cols-2 gap-6">
          {userChildren.map((child) => (
            <div
              key={child.id}
              className="mb-4 border border-gray-300 rounded p-3 bg-gray-50 "
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="">{child.name}</h3>
                <button
                  onClick={() => toggleChildVisibility(child.id)}
                  className="text-sm text-blue-600 underline"
                >
                  {visibleChildren.includes(child.id) ? "Hide" : "View"}
                </button>
              </div>

              {visibleChildren.includes(child.id) && (
                <div className=" text-sm ">
                  {childProfileFields.map(({ key, label, required }) => (
                    <p key={key}>
                      <strong>
                        {label}
                        {required ? " *" : ""}
                      </strong>{" "}
                      {child[key]}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default PatientDetails;
