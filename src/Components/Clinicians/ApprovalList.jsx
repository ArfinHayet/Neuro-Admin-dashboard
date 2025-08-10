import React from "react";

const ApprovalsList = ({ requests = [], onApprove, onReject }) => {
  if (requests.length === 0) {
    return <p className="p-4 text-gray-600">No pending approvals.</p>;
  }

  return (
    <div className="bg-white rounded-lg p-4 ">
      <h2 className="text-lg font-semibold mb-4">Clinician Approval Requests</h2>
      <table className="w-full text-left text-sm ">
        <thead>
          <tr className="bg-gray-100">
            <th className=" p-2">Name</th>
            <th className=" p-2">Specialties</th>
            <th className=" p-2">Requested On</th>
            <th className=" p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b border-gray-200">
              <td className=" p-2">{req.name}</td>
              <td className=" p-2">{req.specialties.join(", ")}</td>
              <td className=" p-2">
                {new Date(req.requestedOn).toLocaleDateString()}
              </td>
              <td className=" p-2 space-x-4 ">
                <button
                  onClick={() => onApprove(req.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(req.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalsList;
