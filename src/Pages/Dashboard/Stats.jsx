import React, { useState } from "react";
import { LuUsers } from "react-icons/lu";
import { MdOutlineCurrencyPound } from "react-icons/md";
import { MdOutlineMedicalServices } from "react-icons/md";
import { getUsers } from "../../api/user";
import { useEffect } from "react";
import { getAllSubmissions } from "../../api/submissions";
import { MdOutlineAssessment } from "react-icons/md";

const Stats = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalClinicians, setTotalClinicians] =  useState(0);
  const [loading, setLoading] = useState(true);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [lastMonthSubmissions, setLastMonthSubmissions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // try {
      //   // Fetch users
      //   const usersData = await getUsers();
      //   console.log(usersData);
      //   const usersCount = Array.isArray(usersData.payload)
      //     ? usersData.payload.length
      //     : 0;
      //   setTotalUsers(usersCount);

       try {
         // Fetch users
         const usersData = await getUsers();
         console.log("Fetched users:", usersData);

         const usersArray = Array.isArray(usersData.payload)
           ? usersData.payload
           : [];

         // Count clinicians
         const clinicianCount = usersArray.filter(
           (u) => u.role === "clinician"
         ).length;

         // Count regular users (exclude admin and clinicians)
         const regularUserCount = usersArray.filter(
           (u) => u.role !== "admin" && u.role !== "clinician"
         ).length;

         setTotalUsers(regularUserCount);
         setTotalClinicians(clinicianCount);

         const submissionsData = await getAllSubmissions();
         const submissions = Array.isArray(submissionsData.payload)
           ? submissionsData.payload
           : [];
         setTotalSubmissions(submissions.length);

         // Last month submissions
         const now = new Date();
         const oneMonthAgo = new Date();
         oneMonthAgo.setMonth(now.getMonth() - 1);

         const lastMonthCount = submissions.filter(
           (s) => new Date(s.createdAt) >= oneMonthAgo
         ).length;

         setLastMonthSubmissions(lastMonthCount);
       } catch (error) {
         console.error("Error fetching data", error);
         setTotalUsers(0);
         setTotalSubmissions(0);
         setLastMonthSubmissions(0);
       } finally {
         setLoading(false);
       }
    };

    fetchData();
  }, []);


  //if (loading) return <p>Loading stats...</p>;

  return (
    <div className="grid grid-cols-4 gap-4 rounded-xl ">
      {/* Users */}
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm text-left flex justify-between items-center">
        <div>
          <p className="text-2xl font-medium">{totalUsers}</p>
          <h3 className="mb-1">Total Users</h3>
        </div>
        <div className="bg-teal-100 bg-opacity-50 rounded-full p-4">
          <LuUsers size={22} className="text-primary" />
        </div>
      </div>

      {/* Clinicians */}
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm text-left flex justify-between items-center">
        <div>
          <p className="text-2xl font-medium">{totalClinicians}</p>{" "}
          <h3 className="mb-1 ">Total Clinicians</h3>
        </div>
        <div className="bg-indigo-100 rounded-full p-4">
          <MdOutlineMedicalServices size={22} className="text-indigo-600" />
        </div>
      </div>

      {/* Total Submissions */}
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <p className="text-2xl font-medium">{totalSubmissions}</p>
          <h3 className="mb-1">Total Submissions</h3>
        </div>
        <div className="bg-orange-200 bg-opacity-50 rounded-full p-4">
          <MdOutlineAssessment size={22} className="text-orange-600" />
        </div>
      </div>

      {/* Last Month Submissions */}
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <p className="text-2xl font-medium">{lastMonthSubmissions}</p>
          <h3 className="mb-1">Last Month Submissions</h3>
        </div>
        <div className="bg-green-200 bg-opacity-50 rounded-full p-4">
          <MdOutlineAssessment size={22} className="text-green-600" />
        </div>
      </div>
    </div>
  );
};

export default Stats;
