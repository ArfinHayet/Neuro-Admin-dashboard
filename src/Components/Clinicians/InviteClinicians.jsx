import React, { useState } from "react";
import TextInput from "../Common/TextInput";
import toast, { Toaster } from "react-hot-toast";

const rolesOptions = [
  { key: "therapist", label: "Therapist" },
  { key: "psychologist", label: "Psychologist" },
  { key: "speech_therapist", label: "Speech Therapist" },
  { key: "occupational_therapist", label: "Occupational Therapist" },
];

const InviteClinicians = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    joinLink: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.joinLink.trim()) newErrors.joinLink = true;
    if (!formData.role.trim()) newErrors.role = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill all fields.");
      return;
    }

    toast.success(`Invitation sent to ${formData.email}!`);
    setFormData({ name: "", email: "", joinLink: "", role: "" });
    setErrors({});
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <Toaster />
      <h2 className="text-xl font-semibold mb-6">Invite New Clinician</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <TextInput
          label="Clinician Name"
          name="name"
          type="text"
          placeholder="Enter clinician's full name"
          value={formData.name}
          onChange={handleChange}
          className=""
          classw={errors.name ? "border-red-600" : ""}
        />

        <TextInput
          label="Clinician Email"
          name="email"
          type="email"
          placeholder="Enter clinician's email"
          value={formData.email}
          onChange={handleChange}
          className=""
          classw={errors.email ? "border-red-600" : ""}
        />

        <TextInput
          label="Joining Link"
          name="joinLink"
          type="text"
          placeholder="Enter invitation joining link"
          value={formData.joinLink}
          onChange={handleChange}
          className=""
          classw={errors.joinLink ? "border-red-600" : ""}
        />

        {/* Raw native select dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#323232]">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full text-sm font-normal p-2 text-darkBlack2 border outline-none rounded-lg bg-white ${
              errors.role ? "border-red-600" : "border-[#EAEAEA]"
            }`}
          >
            <option value="" disabled>
              Select clinician role
            </option>
            {rolesOptions.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary text-white py-2 rounded-full hover:bg-opacity-80 transition w-[40%]"
          >
            Send Invitation
          </button>
        </div>
      </form>
    </section>
  );
};

export default InviteClinicians;
