import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { users, children, } from "../utils/Data";
import { childProfileFields } from "../utils/ChildPorfileConfig";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";


const UserDetails = () => {
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
   <div className=" ">
      <h1 className="font-medium text-2xl mb-4">{user.name}'s Details</h1>

      <section className="mb-4 flex justify-between items-start ">
        <div>
          <h2 className="text-lg font-medium mb-2">Login Information</h2>
          <p className="flex gap-2 items-center">
            <MdOutlineMailOutline size={20} /> {user.email}
          </p>
          <p className="flex gap-2 items-center">
            <LuPhone size={20} /> {user.phone}
          </p>
        </div>
        <div>
          <img
            src={user.image}
            alt={user.name}
            className="h-24 w-24 object-cover"
          />
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-medium ">Address</h2>
        <p className="flex gap-2 items-center">
          <FaRegAddressCard size={20} /> {user.street}, {user.state},{" "}
          {user.country}, {user.postCode}
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-medium ">Personal Information</h2>
        <p>{user.name}</p>
        <p>{user.age} Year</p>
        <p>{user.role}</p>
        <p>
          {user.isBlocked ? (
            <span className="text-red-600 font-semibold">Blocked</span>
          ) : (
            <span className="text-green-600 font-semibold">Active</span>
          )}
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-medium mb-4">Child Profiles</h2>

        {userChildren.length === 0 && (
          <p className="text-gray-600">No child profiles linked.</p>
        )}

        {userChildren.map((child) => (
          <div
            key={child.id}
            className="mb-4 border border-gray-300 rounded p-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{child.name}</h3>
              <button
                onClick={() => toggleChildVisibility(child.id)}
                className="text-sm text-blue-600 underline"
              >
                {visibleChildren.includes(child.id) ? "Hide" : "View"}
              </button>
            </div>

            {visibleChildren.includes(child.id) && (
              <div className="mb-2">
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
      </section>
    </div>
  );
};

export default UserDetails;
