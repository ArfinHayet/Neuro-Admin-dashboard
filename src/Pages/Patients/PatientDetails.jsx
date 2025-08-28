import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { users, children } from "../../Components/utils/Data";
//import { childProfileFields } from "../../Components/utils/ChildPorfileConfig";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { getUsers } from "../../api/user";
import { getPatients } from "../../api/patient";

const PatientDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  // const [visibleChildren, setVisibleChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // const token = localStorage.getItem("assessToken");
      const data = await getUsers();
      const allUsers = data.payload || [];
      const foundUser = allUsers.find((u) => String(u.id) === String(userId));
      if (!foundUser) {
        setUser(null);
        return;
      }
      setUser(foundUser);

      const patientdata = await getPatients();
      const allPatients = patientdata.payload || [];
      const userChildren = allPatients.filter(
        (p) => String(p.userId) === String(foundUser.id)
      );
      setChildren(userChildren);
      if (userChildren.length > 0) setSelectedChildId(userChildren[0].id);
    } catch (err) {
      console.error("error", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  if (!user) {
    return (
      <div className="p-6 ">
        <h2>User not found</h2>
        <button
          onClick={() => navigate("/patients")}
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Back to User List
        </button>
      </div>
    );
  }

  // const toggleChildVisibility = (childId) => {
  //   setVisibleChildren((prev) =>
  //     prev.includes(childId)
  //       ? prev.filter((id) => id !== childId)
  //       : [...prev, childId]
  //   );
  // };

  const selectedChild = children.find((c) => c.id === selectedChildId);

  if (loading) {
    return (
      <div className="flex justify-center items-center  text-gray-500">
        Loading user details...
      </div>
    );
  }

  // console.log(user.image);

  return (
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
      <h1 className="font-semibold text-xl mb-4">{user.name}'s Details</h1>
      <div className="grid grid-cols-3 gap-6 h-[25vh] mb-6 ">
        <section className=" border rounded-lg p-4 border-[#e8e8e8]">
          <h2 className=" font-medium mb-2">Login Information</h2>
          <p className="flex gap-2 items-center text-sm">
            <MdOutlineMailOutline size={18} /> {user.email}
          </p>
          <p className="flex gap-2 items-center text-sm">
            <LuPhone size={16} /> {user.phone}
          </p>
        </section>

        <section className=" border rounded-lg p-4 border-[#e8e8e8]">
          <h2 className=" font-medium mb-1">Address</h2>
          <p className="flex gap-2 items-center text-sm">
            <FaRegAddressCard size={18} /> {user.street}, {user.state},{" "}
            {user.country}, {user.postCode}
          </p>
        </section>

        <section className=" border rounded-lg p-4 border-[#e8e8e8]">
          <h2 className=" font-medium mb-1">Personal Information</h2>
          <p className="text-sm">{user.age} Year</p>
          <p className="text-sm">
            <strong>Role </strong> {user.role}
          </p>
          <p className="text-sm">
            <strong>Know How </strong> {user.knowHow}
          </p>
          {/* <p>
          {user.isBlocked ? (
            <span className="text-red-600 font-semibold text-sm">Blocked</span>
          ) : (
            <span className="text-green-600 font-semibold text-sm">Active</span>
          )}
        </p> */}
        </section>
      </div>

      <section className="mb-3">
        <h2 className="font-semibold mb-2">Child Profiles</h2>
        {children.length === 0 ? (
          <p className="text-gray-600 text-sm">No child profiles linked.</p>
        ) : (
          <div className="flex gap-6 ">
            {/*  Child List */}
            <div className="w-1/3  overflow-y-auto">
              {children.map((child) => (
                <div
                  key={child.id}
                  className={`p-2 cursor-pointer rounded ${
                    selectedChildId === child.id
                      ? "bg-[#31ac9136] font-semibold"
                      : ""
                  }`}
                  onClick={() => setSelectedChildId(child.id)}
                >
                  {child.name}
                </div>
              ))}
            </div>

            {/*  Selected Child Details */}
            <div className="w-3/5 border rounded-lg p-4 overflow-y-auto bg-gray-50">
              {selectedChild ? (
                <>
                  <h3 className="font-medium  mb-2">
                    {selectedChild.name}
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Date of Birth </strong>
                      {selectedChild.dateOfBirth}
                    </p>
                    <p>
                      <strong>Gender </strong> {selectedChild.gender}
                    </p>
                    <p>
                      <strong>Relationship </strong>
                      {selectedChild.relationshipToUser}
                    </p>
                    <p>
                      <strong>About GP </strong> {selectedChild.aboutGp}
                    </p>
                    <p>
                      <strong>Profile Tag </strong> {selectedChild.profileTag}
                    </p>
                    <p>
                      <strong>User ID </strong> {selectedChild.userId}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Select a child to view details</p>
              )}
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default PatientDetails;
