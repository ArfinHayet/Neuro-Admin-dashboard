import React, { useState } from "react";

const InvitationModal = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [specialties, setSpecialties] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onInvite({ email, specialties: specialties.split(",").map((s) => s.trim()) });
    setEmail("");
    setSpecialties("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Invite New Clinician</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="clinician@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Specialties (comma separated)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="Psychology, Psychiatry"
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvitationModal;
