import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { assessments, transactionLogs, clinicians } from "../../Components/utils/Data";

export const Charts = () => {
  const monthlyAssessmentsData = [
    { month: "Jun", assessments: 12 },
    { month: "Jul", assessments: 18 },
    { month: "Aug", assessments: assessments.length },
  ];

  const clinicianActivityData = clinicians.map((clinician) => ({
    name: clinician.name.split(" ")[1],
    activeCases: clinician.casesTaken,
    completedCases: clinician.casesCompleted,
  }));

  // Aggregate total clinician share and platform share for Pie Chart
  const totalClinicianShare = transactionLogs.reduce(
    (sum, log) => sum + log.clinicianShare,
    0
  );
  const totalPlatformShare = transactionLogs.reduce(
    (sum, log) => sum + log.platformShare,
    0
  );

  const revenuePieData = [
    { name: "Clinician Share", value: totalClinicianShare },
    { name: "Platform Share", value: totalPlatformShare },
  ];

  const COLORS = ["#82ca9d", "#ffc658"];

  return (
    <div className=" ">
      {/* 1. Monthly Assessments Completed */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 w-[50%]">
        <h2 className="text-lg font-semibold mb-4">Monthly Assessments Completed</h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyAssessmentsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="assessments"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Clinician Activity
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Clinician Activity</h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={clinicianActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="activeCases"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="completedCases"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* 3. Revenue & Commissions Pie Chart */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 w-[35%]">
        <h2 className="text-lg font-semibold mb-4">Revenue & Commissions</h2>
        <div className="h-52 flex justify-center items-center">
          <ResponsiveContainer width="80%" height="100%">
            <PieChart>
              <Pie
                data={revenuePieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {revenuePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
