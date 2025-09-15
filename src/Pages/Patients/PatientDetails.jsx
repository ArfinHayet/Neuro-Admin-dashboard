import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { getUserById } from "../../api/user";
import { getPatients } from "../../api/patient";

const PatientDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // const token = localStorage.getItem("assessToken");
       const data = await getUserById(userId);
      if (!data || !data.payload) {
        setUser(null);
        return;
      }
      setUser(data.payload);


      const patientdata = await getPatients();
      const allPatients = patientdata.payload || [];
      const userChildren = allPatients.filter(
        (p) => String(p.userId) === String(data.payload.id)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center  text-gray-500">
        Loading user details...
      </div>
    );
  }
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


  const selectedChild = children.find((c) => c.id === selectedChildId);




  return (
    <section className=" ">
      <h1 className="font-semibold text-xl mb-4">{user.name}'s Details</h1>
      <div className="space-y-4 mb-6">
        <section className=" pr-4 border-e-2 ">
          <h2 className=" font-semibold mb-2">Login Information</h2>
          <p className="flex gap-2 items-center justify-start text-sm mb-1">
            <MdOutlineMailOutline size={18} /> {user.email}
          </p>
          <p className="flex gap-2 items-center justify-start text-sm">
            <LuPhone size={16} /> {user.phone}
          </p>
        </section>

        <section className=" ">
          <h2 className=" font-semibold mb-1">Personal Information</h2>
         <div className="space-y-1 text-sm">
          <p>{user.name}</p>
         <p >{user.age} Year</p>
          <p className="">
            <strong>Role </strong> {user.role}
          </p>
          <p className="">
            <strong>Know How </strong> {user.knowHow}
          </p>
          <p className="flex gap-2 items-center ">
            <FaRegAddressCard size={16} /> {user.street}, {user.state}, {user.country}, {user.postCode}
          </p>  
          </div>
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
          <div className="flex gap-4 ">
            {/*  Child List */}
            <div className="w-1/3  overflow-y-auto space-y-2">
              {children.map((child) => (
                <div
                  key={child.id}
                  className={`p-2 cursor-pointer rounded ${
                    selectedChildId === child.id
                      ? "bg-[#77c2af36] font-semibold"
                      : ""
                  }`}
                  onClick={() => setSelectedChildId(child.id)}
                >
                  {child.name}
                </div>
              ))}
            </div>

            {/*  Selected Child Details */}
            <div className="w-3/5 min-h-fit border rounded-lg p-4 overflow-y-auto bg-gray-50">
              {selectedChild ? (
                <>
                  <h3 className="font-medium  mb-2">
                    {selectedChild.name}
                  </h3>
                  <div className="text-sm space-y-1 ">
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
