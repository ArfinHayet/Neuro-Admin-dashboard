import React from "react";

const SubmittedInitials = ({ assessments, users, children, onView }) => {
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getChildName = (childId) => {
    const child = children.find((c) => c.id === childId);
    return child ? child.name : "Unknown Child";
  };

  return (
    <table className="bg-white w-full text-center border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2">User Name</th>
          <th className="border border-gray-300 p-2">Child Name</th>
          <th className="border border-gray-300 p-2">Date Taken</th>
          <th className="border border-gray-300 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {assessments.map((assess) => (
          <tr
            key={assess.id}
            className="border border-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            <td className="border border-gray-300 p-2">{getUserName(assess.userId)}</td>
            <td className="border border-gray-300 p-2">{getChildName(assess.childId)}</td>
            <td className="border border-gray-300 p-2">{assess.dateTaken}</td>
            <td className="border border-gray-300 p-2">
              <button
                onClick={() => onView(assess.id)}
                className="px-3 py-1 bg-primary text-white text-sm rounded-full"
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SubmittedInitials;
