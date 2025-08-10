import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { users, children, assessments, clinicianFeedbacks } from "../utils/Data";
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
      <div className="p-6 max-w-4xl mx-auto">
        <h2>User not found</h2>
        <button
          onClick={() => navigate("/patients")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
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
          console.log(user.image);


  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4">{user.name}'s Details</h1>

      <section className="mb-6 flex justify-between items-start ">
        <div>
          <h2 className="text-lg font-semibold mb-2">Login Information</h2>
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

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Address</h2>
        <p className="flex gap-2 items-center">
          <FaRegAddressCard size={20} /> {user.street}, {user.state},{" "}
          {user.country}, {user.postCode}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
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

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Child Profiles</h2>

        {userChildren.length === 0 && (
          <p className="text-gray-600">No child profiles linked.</p>
        )}

        {userChildren.map((child) => {
          // assessments linked to child
          const childAssessments = assessments.filter(
            (a) => a.childId === child.id
          );

          return (
            <div
              key={child.id}
              className="mb-6 border border-gray-300 rounded p-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">{child.name}</h3>
                <button
                  onClick={() => toggleChildVisibility(child.id)}
                  className="text-sm text-blue-600 underline"
                >
                  {visibleChildren.includes(child.id) ? "Hide" : "View"}
                </button>
              </div>

              {visibleChildren.includes(child.id) && (
                <>
                  {/* child profiles */}
                  <div className="mb-4">
                    {childProfileFields.map(({ key, label, required }) => (
                      <p key={key}>
                        <strong>
                          {label}
                          {required ? " *" : ""}:
                        </strong>{" "}
                        {child[key]}
                      </p>
                    ))}
                  </div>

                  {/* Assessment History
                  <div>
                    <h4 className="text-md font-semibold mb-2">
                      Assessment History
                    </h4>
                    {childAssessments.length > 0 ? (
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">
                              Name
                            </th>
                            <th className="border border-gray-300 p-2 text-left">
                              Date Taken
                            </th>
                            <th className="border border-gray-300 p-2 text-left">
                              Type
                            </th>
                            <th className="border border-gray-300 p-2 text-left">
                              Status
                            </th>
                            <th className="border border-gray-300 p-2 text-left">
                              Clinician Feedbacks
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {childAssessments.map((assessment) => {
                            // clinician feedbacks to this assessment
                            const feedbacks = clinicianFeedbacks.filter(
                              (fb) => fb.assessmentId === assessment.id
                            );

                            return (
                              <tr key={assessment.id}>
                                <td className="border border-gray-300 p-2">
                                  {assessment.name}
                                </td>
                                <td className="border border-gray-300 p-2">
                                  {assessment.dateTaken}
                                </td>
                                <td className="border border-gray-300 p-2">
                                  {assessment.type}
                                </td>
                                <td className="border border-gray-300 p-2">
                                  {assessment.status}
                                </td>
                                <td className="border border-gray-300 p-2">
                                  {assessment.type === "On Demand" ? (
                                    feedbacks.length > 0 ? (
                                      <ul className="list-disc pl-5">
                                        {feedbacks.map((fb) => (
                                          <li key={fb.id}>
                                            <strong>{fb.clinician}:</strong>{" "}
                                            {fb.feedback}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      "Review in processing"
                                    )
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p>No assessments found.</p>
                    )}
                  </div>*/}
                </>
              )}
            </div> 
          );
        })}
      </section>
    </div>
  );
};

export default UserDetails;
