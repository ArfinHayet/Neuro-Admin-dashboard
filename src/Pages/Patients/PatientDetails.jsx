import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, deleteUser } from "../../api/user";
import { getPatients } from "../../api/patient";
import { MdLocationPin, MdEmail } from "react-icons/md";
import { RiPhoneFill } from "react-icons/ri";
import { getPayments } from "../../api/payment";
import toast from "react-hot-toast";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaUserCog } from "react-icons/fa";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";


const PatientDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageURL = import.meta.env.VITE_IMAGE_BASE_URL;

  const [payments, setPayments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // const token = localStorage.getItem("assessToken");
      const data = await getUserById(userId);
      if (!data || !data.payload) {
        setUser(null);
        return;
      }
      console.log(data);
      setUser(data.payload);

      const patientdata = await getPatients();
      const allPatients = patientdata.payload || [];
      const userChildren = allPatients.filter(
        (p) => String(p.userId) === String(data.payload.id)
      );

      console.log(userChildren);
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

  const fetchPayment = async (patientId, userId) => {
    try {
      setPaymentLoading(true);

      const res = await getPayments();

      if (res?.payload) {
        const filteredPayments = res.payload.filter(
          (p) => String(p.userId) === String(userId)
        );

        setPayments(filteredPayments);
        console.log(filteredPayments);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.log("Payment fetch error", err);
      toast.error("Failed to load payments");
      setPayments([]);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChildId && user?.id) {
      fetchPayment(selectedChildId, user.id);
    }
  }, [selectedChildId, user?.id]);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center  text-gray-500">
  //       Loading user details...
  //     </div>
  //   );
  // }
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

  const handleDeleteUser = async (id) => {
    if (!id) {
      toast.error("User ID not found");
      return;
    }

    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      setShowModal(false);
      navigate("/patients");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <section className=" ">
      <div className="flex justify-between">
        <h1 className="font-semibold text-xl mb-4">{user.name}'s Details</h1>
        <button
          onClick={() => setShowModal(true)}
          className="absolute right-10 px-4 py-2 rounded-md bg-[#114654]/80 hover:bg-[#114654] text-white text-sm flex gap-1"
        >
          <MdDeleteForever size={20} /> Delete user
        </button>
      </div>
      <section className="space-y-6">
        <section className="space-y-4  mb-6 flex justify-start  items-center gap-10">
          <section className="w-[30%] flex flex-col justify-center items-center space-y-2">
            <img
              // src={`${imageURL}${user.image}`}
              src={
                user.image ? `${imageURL}${user.image}` : "/png/placeholder.png"
              }
              className="rounded-full h-20 w-20 object-cover "
            />
            <div className="flex flex-col items-center gap-0.5 justify-center">
              {/* <h2 className=" font-semibold mb-2">Login Information</h2> */}
              <p className="text-xl font-semibold ">{user.name}</p>
              <p className="flex gap-2 items-center text-sm ">
                <MdEmail className="text-gray-500" size={18} /> {user.email}
              </p>
              <p className="flex gap-2 items-center  text-sm">
                <RiPhoneFill className="text-gray-500" size={16} /> {user.phone}
              </p>
            </div>
          </section>

          <section className="w-[50%] rounded-lg border shadow-md  p-4 ">
            <h2 className=" font-semibold mb-1">Personal Information</h2>
            <div className="space-y-1 text-sm">
              {/* <p>{user.name}</p> */}
              <p className="flex gap-2 items-center">
                {" "}
                <BsCalendarDateFill className=" text-gray-600" size={14} />{" "}
                <span>{user.age} Year</span>
              </p>
              <p className=" flex items-center gap-2">
                <FaUserCog className=" text-gray-600" /> <strong>Role </strong>{" "}
                {user.role}
              </p>
              <p className=" flex items-center gap-2">
                <BiSolidMessageRoundedDots
                  className="text-gray-600 -ml-0.5 "
                  size={16}
                />{" "}
                <strong>Know How </strong> {user.knowHow}
              </p>
              <p className="flex gap-2 items-center ">
                <MdLocationPin size={18} className="-ml-1 text-gray-600" />{" "}
                {user.street}, {user.state}, {user.country}, {user.postCode}
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
         
        </section>
     
        <section className="">
          <h2 className="font-semibold mb-2">Child Profiles</h2>
          {children.length === 0 ? (
            <p className="text-gray-600 text-sm">No child profiles linked.</p>
          ) : (
            <div className="flex gap-4 ">
              {/*  Child List */}
              <div className="w-[32%]  overflow-y-auto space-y-2  text-xs">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className={`px-2 py-3 cursor-pointer rounded ${
                      selectedChildId === child.id
                        ? "bg-[#89dbd736] font-semibold"
                        : ""
                    }`}
                    onClick={() => setSelectedChildId(child.id)}
                  >
                    {child.name}
                  </div>
                ))}
              </div>

              {/*  Selected Child Details */}
              <div className="w-[50%] min-h-fit  overflow-y-auto rounded-lg  border shadow-md  p-4">
                {selectedChild ? (
                  <>
                    <h3 className="font-medium  mb-2 text-lg">{selectedChild.name}</h3>
                    <div className="flex justify-start gap-20 items-center text-xs ">
                      <div className="space-y-1 font-semibold">
                        <p>Date of Birth</p>

                        <p>Gender</p>

                        <p>Relationship</p>

                        <p>About GP</p>

                        <p>Profile Tag</p>
                      </div>
                      <div className="space-y-1">
                        <p>{selectedChild.dateOfBirth || "N/A"}</p>

                        <p>{selectedChild.gender || "N/A"}</p>

                        <p>{selectedChild.relationshipToUser || "N/A"}</p>

                        <p>{selectedChild.aboutGp || "N/A"}</p>

                        <p>{selectedChild.profileTag || "N/A"}</p>
                      </div>{" "}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Select a child to view details
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="mt-4">
          <h2 className="font-semibold mb-2">Payment Details</h2>

          {paymentLoading ? (
            <p className="text-gray-500">Loading payments...</p>
          ) : payments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payment records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-xs text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">SL</th>
                    <th className="border px-3 py-2">Amount</th>
                    <th className="border px-3 py-2">Status</th>
                    <th className="border px-3 py-2">Date</th>
                    <th className="border px-3 py-2">Currency</th>
                    <th className="border px-3 py-2">Assessment Name</th>
                    <th className="border px-3 py-2">Patient Name</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((p, index) => (
                    <tr key={p.id}>
                      <td className="border px-3 py-2">{index + 1}</td>
                      <td className="border px-3 py-2">{p.amount}</td>
                      <td className="border px-3 py-2">{p.paymentStatus}</td>
                      <td className="border px-3 py-2">{p.createdAt}</td>
                      <td className="border px-3 py-2">{p.currency}</td>
                      <td className="border px-3 py-2">{p.assessment?.name}</td>
                      <td className="border px-3 py-2">{p.patient?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center pt-12 bg-black bg-opacity-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-sm mb-4">
              Are you sure you want to delete this User?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDeleteUser(user.id);
                  setShowModal(false);
                }}
                className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-80 text-sm"
              >
                Yes
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PatientDetails;
