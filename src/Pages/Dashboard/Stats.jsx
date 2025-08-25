import React from "react";
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
import { useState } from "react";

const Stats = () => {
  const [totalUsers, setTotalUsers] = useState();
  const [loading, setLoading] = useState(true);
  // const [totalCommissions, setTotalCommissions] = useState();
  // const [lastMonthCommissions, setLastMonthCommissions] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setTotalUsers(usersData.length);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const totalClinicians = clinicians.length;

  // Calculate total revenue from transaction logs
  const totalRevenue = transactionLogs.reduce(
    (sum, log) => sum + log.amount,
    0
  );
  const totalCommissions = transactionLogs.reduce(
    (sum, log) => sum + log.amount,
    0
  );

  // Calculate last month's commissions
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const lastMonthCommissions = transactionLogs
    .filter((log) => new Date(log.date) >= oneMonthAgo)
    .reduce((sum, log) => sum + log.amount, 0);

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
          {" "}
          <p className="text-2xl font-medium">{totalClinicians}</p>{" "}
          <h3 className="mb-1 ">Total Clinicians</h3>
        </div>
        <div className="bg-indigo-100 rounded-full p-4">
          <MdOutlineMedicalServices size={22} className="text-indigo-600" />
        </div>
      </div>

      {/* Revenue
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm text-left flex justify-between items-center ">
        <div>
          <p className="text-2xl font-medium">${totalRevenue}</p>{" "}
          <h3 className="mb-1 ">Total Revenue</h3>
        </div>
        <div className="bg-orange-200 bg-opacity-50 rounded-full p-4">
          <MdOutlineCurrencyPound size={22} className="text-orange-600" />
        </div>
      </div> */}

      {/* Total Commissions */}
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm text-left flex justify-between items-center">
        <div>
          <p className="text-2xl font-medium">£{totalCommissions}</p>
          <h3 className="mb-1">Total Commissions</h3>
        </div>
        <div className="bg-orange-200 bg-opacity-50 rounded-full p-4">
          <MdOutlineCurrencyPound size={22} className="text-orange-600" />
        </div>
      </div>

      {/* Last Month Commissions */}
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm text-left flex justify-between items-center">
        <div>
          <p className="text-2xl font-medium">£{lastMonthCommissions}</p>
          <h3 className="mb-1">Last Month’s Commissions</h3>
        </div>
        <div className="bg-green-200 bg-opacity-50 rounded-full p-4">
          <MdOutlineCurrencyPound size={22} className="text-green-600" />
        </div>
      </div>
    </div>
  );
};

export default Stats;
