import React, { useState } from "react";

const LeaveManagement = ({ leaveRequests = [], upcomingLeaves = [] }) => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="bg-white rounded-lg p-4 ">
      <h2 className="text-xl font-semibold mb-4">Leave Management</h2>

      {/* Tabs */}
      <div className="flex  mb-4">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "requests"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Leave Requests
        </button>
        <button
          className={`ml-4 px-4 py-2 font-semibold ${
            activeTab === "schedule"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("schedule")}
        >
          Upcoming Leaves
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "requests" && (
        <div>
          {leaveRequests.length === 0 ? (
            <p className="text-gray-600">No leave requests pending.</p>
          ) : (
            <table className="w-full text-sm  text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className=" p-2">Clinician</th>
                  <th className=" p-2">From</th>
                  <th className=" p-2">To</th>
                  <th className=" p-2">Reason</th>
                  <th className=" p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 border-b border-gray-200 my-4">
                    <td className=" p-2">{leave.clinicianName}</td>
                    <td className=" p-2">{leave.fromDate}</td>
                    <td className=" p-2">{leave.toDate}</td>
                    <td className=" p-2">{leave.reason}</td>
                    <td className=" p-2">{leave.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "schedule" && (
        <div>
          {upcomingLeaves.length === 0 ? (
            <p className="text-gray-600">No upcoming leaves scheduled.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {upcomingLeaves.map((leave) => (
                <li key={leave.id}>
                  {leave.clinicianName}: {leave.fromDate} to {leave.toDate}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
