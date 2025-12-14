import React, { useState } from "react";
import TextInput from "../../Components/Common/TextInput";
import toast, { Toaster } from "react-hot-toast";
import { sendEmail } from "../../api/email";

const CliniciansOnboarding = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    joinLink: "https://clinician.neurocheckpro.com/signup",
    // joinLink: "https://neurocheck-clinician.vercel.app/signup",
  });

  const [errors, setErrors] = useState({});

  const buildEmailHTML = ({ name, subject, joinLink }) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2A6FDB;">NeuroCheckPro – Clinician Invitation</h2>
    
        <p>Dear <strong>${name}</strong>,</p>
    
        <p>
          We are pleased to invite you to join the <strong>NeuroCheckPro Clinician Platform</strong>.
          You have been selected to join our secured system where clinicians can access tools,
          manage assessments, and collaborate efficiently.
        </p>
    
        <p>
          Please use the link below to complete your onboarding and create your clinician account:
        </p>
    
        <a href="${joinLink}" 
           style="display:inline-block;margin-top:10px;padding:10px 18px;
           background:#2A6FDB;color:#fff;text-decoration:none;border-radius:6px;">
          Complete Signup
        </a>
    
        <p style="margin-top:20px;">
          If you have any questions or need assistance, feel free to contact us.
        </p>
    
        <p>Best regards,<br /><strong>NeuroCheckPro Team</strong></p>
    
        <hr style="margin-top:30px;opacity:0.3;" />
    
        <p style="font-size:12px;color:#777;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.subject.trim()) newErrors.subject = true;
    if (!formData.joinLink.trim()) newErrors.joinLink = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill all fields.");
      return;
    }

    const payload = {
      to: formData.email,
      subject: formData.subject,
      text: "Welcome to NeuroCheckPro Clinician Platform!",
      html: buildEmailHTML(formData),
    };

    try {
      await sendEmail(payload);
      toast.success(`Invitation sent to ${formData.email}!`);

      setFormData({
        name: "",
        email: "",
        subject: "",
        joinLink: "https://clinician.neurocheckpro.com/signup",
      });
    } catch (error) {
      toast.error("Failed to send invitation!");
    }
  };

  return (
    <section>
      <h1 className="font-semibold text-xl">Clinicians Onboarding</h1>
      <p className="text-secondary text-sm">
        Send invitation to new clinicians to onboard them into the system.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-6 pr-2">
        <Toaster />
       
          

        {/* LEFT SIDE FORM */}
        <form
          onSubmit={handleSubmit}
          className="  space-y-6  border-e-2 pr-6"
        >
          <TextInput
            label="Clinician Name"
            name="name"
            type="text"
            placeholder="Enter clinician's full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            classw={errors.name ? "border-red-600" : ""}
          />

          <TextInput
            label="Clinician Email"
            name="email"
            type="email"
            placeholder="Enter clinician's email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            classw={errors.email ? "border-red-600" : ""}
          />

          <TextInput
            label="Email Subject"
            name="subject"
            type="text"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            classw={errors.subject ? "border-red-600" : ""}
          />

          <TextInput
            label="Joining Link"
            name="joinLink"
            type="text"
            placeholder="Enter signup link"
            value={formData.joinLink}
            onChange={(e) =>
              setFormData({ ...formData, joinLink: e.target.value })
            }
            classw={errors.joinLink ? "border-red-600" : ""}
          />

          <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-primary text-sm text-white py-2 rounded-full hover:bg-opacity-80 transition w-[20vw]"
          >
            Send Invitation
            </button>
          </div>
        </form>

        {/* RIGHT SIDE LIVE EMAIL PREVIEW */}
        <div className="col-span-2">
        <div className="border p-4 rounded-lg shadow bg-white  h-[75vh] overflow-auto">
          <h2 className="font-semibold mb-2 text-lg">Email Preview</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: buildEmailHTML(formData),
            }}
          ></div>
        </div>
         </div>
        </div>
    
    </section>
  );
};

export default CliniciansOnboarding;
