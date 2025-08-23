import React, { useState } from "react";
import TextInput from "../../Components/Common/TextInput";
import toast, { Toaster } from "react-hot-toast";

const rolesOptions = [
  { key: "therapist", label: "Therapist" },
  { key: "psychologist", label: "Psychologist" },
  { key: "speech_therapist", label: "Speech Therapist" },
  { key: "occupational_therapist", label: "Occupational Therapist" },
];

const CliniciansOnboarding = () => {
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
       <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-5">

        <h1 className="font-semibold text-xl mb-1">Clinicians Onboarding</h1>
        <p className="text-secondary text-sm ">Send invitation to new clinicians to onboard them into the system.</p>
        <section className=" mt-6 pr-2">
          <Toaster />
        { /* <h2 className="text-  mb-2 text-primary">Invite New Clinician</h2> */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 w-[55vw] items-center">
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

            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-[#323232]">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full text-xs font-normal p-3 text-[#565656] border outline-none rounded-lg bg-white ${
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
          </form>

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="bg-primary text-sm text-white py-2 rounded-full hover:bg-opacity-80 transition w-[20vw]"
              >
                Send Invitation
              </button>
            </div>
        </section>
    </section>
  );
};

export default CliniciansOnboarding;
