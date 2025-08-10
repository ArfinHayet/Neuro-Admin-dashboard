import React from "react";

const UserStats = ({ users = [] }) => {
  const total = users.length;

  const recent = users.filter((user) => {
    if (!user.joinDate) return false;
    const joinDate = new Date(user.joinDate);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return joinDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="grid grid-cols-5 gap-4 mb-6 text-center">
      <div className="bg-white p-4 rounded-xl">
        <h2 className=" font-medium ">Total Users</h2>
        <p className="text-2xl pt-2">{total}</p>
      </div>
      <div className="bg-white p-4 rounded-xl">
        <h2 className=" font-medium ">New in Last 30 Days</h2>
        <p className="text-2xl pt-2">{recent}</p>
      </div>
    </div>
  );
};

export default UserStats;
