import React from "react";

const SubmittedOnDemandList = ({ assessments, users, children, categories, onView }) => {
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getChildName = (childId) => {
    const child = children.find((c) => c.id === childId);
    return child ? child.name : "-";
  };

  const getCategoryTitle = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.title : "Unknown Category";
  };

  return (
    <table className="w-full border-collapse border border-gray-300 text-center bg-white text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2">User Name</th>
          <th className="border border-gray-300 p-2">Child Name</th>
          <th className="border border-gray-300 p-2">Date Taken</th>
          <th className="border border-gray-300 p-2">Assessment Category</th>
          <th className="border border-gray-300 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {assessments.map(({ id, userId, childId, dateTaken, categoryId }) => (
          <tr key={id} className="border border-gray-300">
            <td className="border border-gray-300 p-2">{getUserName(userId)}</td>
            <td className="border border-gray-300 p-2">{getChildName(childId)}</td>
            <td className="border border-gray-300 p-2">{dateTaken}</td>
            <td className="border border-gray-300 p-2">{getCategoryTitle(categoryId)}</td>
            <td className="border border-gray-300 p-2">
              <button
                onClick={() => onView(id)}  
                className="px-3 py-1 bg-primary text-white rounded-full"
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

export default SubmittedOnDemandList;
