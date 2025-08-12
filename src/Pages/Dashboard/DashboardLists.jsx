import React from "react";
import {
  users,
  clinicians,
  assessments,
} from "../../Components/utils/Data";

const DashboardLists = () => {
  const newUsersLast30Days = users.filter((user) => {
    if (!user.createdAt) return false;
    const createdDate = new Date(user.createdAt);
    const daysDiff =
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  });

  const newCliniciansLast30Days = clinicians.filter((c) => {
    if (!c.createdAt) return false;
    const createdDate = new Date(c.createdAt);
    const daysDiff =
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  });

  const activeClinicians = clinicians.filter((c) => c.status === "active");

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  // Filter assessments from last 30 days
  const recentAssessments = assessments.filter((a) => {
    const dateTaken = new Date(a.dateTaken);
    const now = new Date();
    const diffDays = (now - dateTaken) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  });

  return (
    <div className=" space-y-10 ">
      {/* On-Demand Assessments */}
      <div className="grid grid-cols-2 gap-4 ">
     
        {/* Recent Assessments */}
        <section className="bg-white p-4 rounded-lg border border-gray-200 ">
          <h2 className="text-lg font-medium mb-1">
            New On-demand Assessments
          </h2>
          {recentAssessments.length === 0 ? (
            <p>No new assessments in the last 30 days.</p>
          ) : (
            <ul className="">
              {recentAssessments.map(
                ({ id, name, userId, dateTaken, status }) => (
                  <li
                    key={id}
                    className="flex justify-between items-center border-b last:border-none p-1 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <p className=" text-sm">{name}</p>
                      <span className="text-xs text-secondary">
                        By: {getUserName(userId)} | Date: {dateTaken}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </li>
                )
              )}
            </ul>
          )}
        </section>
      </div>

      {/* Active Clinicians */}
      <section className="bg-white rounded-lg  border border-gray-200 p-4 w-[50%]">
        <h2 className="text-lg font-semibold mb-1">Active Clinicians</h2>
        {activeClinicians.length === 0 ? (
          <p className="text-gray-500">No active clinicians found.</p>
        ) : (
          <ul>
            {activeClinicians.map((clinician) => (
              <li
                key={clinician.id}
                className="border-b py-2 last:border-none flex items-center gap-3"
              >
                <img
                  src={clinician.image}
                  alt={clinician.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm">{clinician.name}</p>
                  <p className="text-xs text-secondary">{clinician.title}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4">
        {/* New Users */}
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-medium mb-1">
            New Users <span className="text-sm">(Last 30 Days)</span>
          </h2>
          {newUsersLast30Days.length === 0 ? (
            <p className="text-gray-500">No new users in the last 30 days.</p>
          ) : (
            <ul>
              {newUsersLast30Days.map((user) => (
                <li key={user.id} className="border-b py-2 last:border-none">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-secondary">{user.email}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* New Clinicians */}
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-medium mb-1">
            New Clinicians <span className="text-sm">(Last 30 Days)</span>
          </h2>
          {newCliniciansLast30Days.length === 0 ? (
            <p className="text-gray-500">
              No new clinicians in the last 30 days.
            </p>
          ) : (
            <ul>
              {newCliniciansLast30Days.map((clinician) => (
                <li
                  key={clinician.id}
                  className="border-b py-2 last:border-none flex items-center gap-3"
                >
                  <img
                    src={clinician.image}
                    alt={clinician.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm">{clinician.name}</p>
                    <p className="text-xs text-secondary">{clinician.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardLists;
