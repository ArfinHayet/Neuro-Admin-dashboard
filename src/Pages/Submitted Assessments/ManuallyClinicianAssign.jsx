import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/user";
import { assignClinicianToSubmission } from "../../api/submissions";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const ManuallyClinicianAssign = ({
  show,
  onClose,
  submissionIds,
  onSuccess,
}) => {
  const [clinicians, setClinicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState(null); // ✅ boolean এর বদলে ID track করবে

  useEffect(() => {
    if (show) {
      fetchClinicians();
    }
  }, [show]);

  const fetchClinicians = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      const allUsers = res?.payload || [];
      const clinicianList = allUsers.filter(
        (user) => user.role === "clinician",
      );
      console.log(clinicianList);
      setClinicians(clinicianList);
    } catch (err) {
      console.error("Failed to fetch clinicians:", err);
      toast.error("Failed to load clinicians");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (clinicianId) => {
    try {
      setAssigningId(clinicianId);

      await Promise.all(
        submissionIds.map((id) => assignClinicianToSubmission(id, clinicianId)),
      );

      toast.success("Clinician assigned successfully!");
      onSuccess(clinicianId);
      onClose();
    } catch (err) {
      console.error("Failed to assign:", err);
      toast.error("Failed to assign clinician");
    } finally {
      setAssigningId(null);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-md h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assign Clinician</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Clinician List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="custom-loader"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {clinicians.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No clinicians available
              </p>
            ) : (
              clinicians.map((clinician) => (
                <div
                  key={clinician.id}
                  className="border rounded-md p-4 hover:bg-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{clinician.name}</p>
                      <p className="text-sm text-gray-600">
                        {clinician.hcpcTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAssign(clinician.id)}
                      disabled={assigningId === clinician.id}
                      className="px-4 py-1 bg-[#114654]/80 hover:bg-primary text-white rounded-md text-sm disabled:bg-gray-400"
                    >
                      {assigningId === clinician.id ? "Assigning..." : "Assign"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManuallyClinicianAssign;
