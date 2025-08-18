import React from "react";
import {
  users,
  clinicians,
  transactionLogs,
} from "../../Components/utils/Data";
import { LuUsers } from "react-icons/lu";
import { MdOutlineCurrencyPound } from "react-icons/md";
import { MdOutlineMedicalServices } from "react-icons/md";


const Stats = () => {
  const totalUsers = users.length;

  const totalClinicians = clinicians.length;

  // Calculate total revenue from transaction logs
  const totalRevenue = transactionLogs.reduce(
    (sum, log) => sum + log.amount,
    0
  );

  return (
    <div className="grid grid-cols-4 gap-4 rounded-xl ">
      {/* Users */}
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm text-left flex justify-between items-center">
        <div>
          <p className="text-2xl font-medium">{totalUsers}</p>
          <h3 className="mb-1">Total Users</h3>
        </div>
        <div className="bg-teal-100 bg-opacity-50 rounded-full p-4">
          <LuUsers size={22} className="text-primary"/>
        </div>
      </div>

      {/* Clinicians */}
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm text-left flex justify-between items-center">
       <div> <p className="text-2xl font-medium">{totalClinicians}</p>{" "}
        <h3 className="mb-1 ">Total Clinicians</h3>
        
         
        </div>
        <div className="bg-indigo-100 rounded-full p-4">
          <MdOutlineMedicalServices  size={22} className="text-indigo-600" />
        </div>
      </div>

      {/* Revenue */}
      <div className="bg-[#F8F9FA] p-4 rounded-xl shadow-sm text-left flex justify-between items-center ">
       <div><p className="text-2xl font-medium">${totalRevenue}</p>{" "}
        <h3 className="mb-1 ">Total Revenue</h3>
        </div> 
         <div className="bg-orange-200 bg-opacity-50 rounded-full p-4">
          <MdOutlineCurrencyPound size={22} className="text-orange-600"/>
        </div>
      </div>
    </div>
  );
};

export default Stats;
