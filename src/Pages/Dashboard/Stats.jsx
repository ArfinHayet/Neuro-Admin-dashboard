
import React from "react";
import { users } from "../../Components/utils/Data";
import { clinicians } from "../../Components/utils/Data"; 

const Stats = () => {

    const totalUsers = users.length;
  const newUsersLast30Days = users.filter(user => {
    const createdDate = new Date(user.createdAt);
    const daysDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  }).length;

  const totalClinicians = clinicians.length;
  const newCliniciansLast30Days = clinicians.filter((c) => {
    const createdDate = new Date(c.createdAt);
    const daysDiff =
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6  rounded-xl text-center">
      {/* Users */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="mb-2 font-medium ">Total Users</h3>
        <p className="text-2xl font-bold ">{totalUsers}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="mb-2 font-medium ">New Users (30 days)</h3>
        <p className="text-2xl font-bold">{newUsersLast30Days}</p>
      </div>

      {/* Clinicians */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="mb-2 font-medium ">Total Clinicians</h3>
        <p className="text-2xl font-bold">{totalClinicians}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className=" font-medium ">
          New Clinicians
        </h3>
        <p className="text-2xl font-bold">{newCliniciansLast30Days}</p>
      </div>
    </div>
  );
};

export default Stats;
