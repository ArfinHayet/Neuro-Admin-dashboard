import React, { useState } from "react";
import {
  users,
  clinicians,
  transactionLogs,
} from "../../Components/utils/Data";
import { LuUsers } from "react-icons/lu";
import { MdOutlineCurrencyPound } from "react-icons/md";
import { MdOutlineMedicalServices } from "react-icons/md";
import { getUsers } from "../../api/user";
import { useEffect } from "react";
import { getAllSubmissions } from "../../api/submissions";
import { MdOutlineAssessment } from "react-icons/md";

const Stats = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [lastMonthSubmissions, setLastMonthSubmissions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersData = await getUsers(1, 1000);
        const usersCount = Array.isArray(usersData.payload)
          ? usersData.payload.length
          : 0;
        setTotalUsers(usersCount);

        // Fetch submissions
        const submissionsData = await getAllSubmissions(1, 1000);
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

  const totalClinicians = clinicians.length;

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
