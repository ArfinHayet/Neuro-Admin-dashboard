import React, { useState, useEffect } from "react";
import {
  onDemandAssessments,
  users,
  clinicians,
  assessments,
  transactionLogs,
  assessmentCategories,
} from "../../Components/utils/Data";
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
  BarChart,
  Bar,
} from "recharts";
import Stats from "./Stats";
import { getUsers } from "../../api/user";
import { getAssessments } from "../../api/assessments";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const filterLast30Days = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  };

  const [latestUsers, setLatestUsers] = useState([]);
  const [onDemandAssessmentsData, setOnDemandAssessmentsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(1, 10);
        //  console.log("API raw response:", data);
        if (data && Array.isArray(data.payload)) {
          const filteredUsers = data.payload.filter(
            (user) => user.role !== "clinician" && user.role !== "admin"
          );
          setLatestUsers(filteredUsers);
        } else {
          console.error("Unexpected API response structure:", data);
          setLatestUsers([]);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setLatestUsers([]);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAssessments();
        if (data && Array.isArray(data.payload)) {
          // Only extract the name of each assessment
          const assessmentsList = data.payload.map((item) => ({
            id: item.id,
            name: item.name,
          }));
          setOnDemandAssessmentsData(assessmentsList);
        } else {
          console.error("Unexpected API response structure:", data);
          setOnDemandAssessmentsData([]);
        }
      } catch (err) {
        console.error("Failed to fetch assessments:", err);
        setOnDemandAssessmentsData([]);
      }
    };

    fetchAssessments();
  }, []);

  const activeClinicians = clinicians.filter((c) => c.status === "active");

  const recentAssessments = assessments.filter((a) =>
    filterLast30Days(a.dateTaken)
  );

  const getTopClinicians = (data, limit = 3) => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    return data
      .filter((c) => new Date(c.joinedDate) >= last30Days)
      .sort((a, b) => b.casesTaken - a.casesTaken)
      .slice(0, limit);
  };
  const topClinicians = getTopClinicians(clinicians);

  // Charts data
  const monthlyAssessmentsData = [
    { month: "Jun", assessments: 12 },
    { month: "Jul", assessments: 18 },
    { month: "Aug", assessments: assessments.length },
  ];

  const monthlyGrowthData = [
    {
      month: "Jun",
      users: 15,
      clinicians: 3,
      assessments: 12,
      revenue: 1200,
    },
    {
      month: "Jul",
      users: 28,
      clinicians: 7,
      assessments: 18,
      revenue: 2400,
    },
    {
      month: "Aug",
      users: users.length,
      clinicians: clinicians.length,
      assessments: assessments.length,
      revenue: transactionLogs.reduce((sum, t) => sum + t.amount, 0),
    },
  ];

  // const totalClinicianShare = transactionLogs.reduce(
  //   (sum, log) => sum + log.clinicianShare,
  //   0
  // );
  // const totalPlatformShare = transactionLogs.reduce(
  //   (sum, log) => sum + log.platformShare,
  //   0
  // );

  // const revenuePieData = [
  //   { name: "Clinician Share", value: totalClinicianShare },
  //   { name: "Platform Share", value: totalPlatformShare },
  // ];

  const COLORS = ["#82ca9d", "#ffc658"];

  return (
    <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
      <h1 className="text-xl font-semibold mb-0">Dashboard</h1>
      <p className="text-sm mb-4 text-secondary">
        Get an overview of your platform’s performance, user engagement, and
        clinician activity.
      </p>
      <div className="mb-4">
        <Stats />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Active Clinicians */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 ">
            <h2 className="text-sm font-semibold ">New Clinicians</h2>
            {activeClinicians.length === 0 ? (
              <p className="text-gray-500">No active clinicians found.</p>
            ) : (
              <ul className="overflow-y-auto max-h-[400px]">
                {activeClinicians.map((clinician) => (
                  <li
                    key={clinician.id}
                    className="border-b py-2 last:border-none flex items-center gap-3"
                  >
                    <img
                      src={clinician.image}
                      alt={clinician.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs">{clinician.name}</p>
                      <p className="text-xs text-secondary">
                        {clinician.title}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* new users */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 ">
            <h2 className="text-sm font-semibold ">
              New Users <span className="text-sm">(Last 30 Days)</span>
            </h2>
            {latestUsers.length === 0 ? (
              <p className="text-gray-500">No new users found.</p>
            ) : (
              <ul className="overflow-y-auto max-h-fit">
                {latestUsers.map((user) => (
                  <li key={user.id} className="border-b py-2 last:border-none">
                    <p className="text-xs">{user.name}</p>
                    <span className="flex justify-between items-center ">
                      <p className="text-xs text-secondary">{user.email}</p>
                      <p className="text-xs text-secondary">{user.role}</p>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Middle Column */}
        <div className="space-y-4">
          {/* Top Clinicians Last 30 Days */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 ">
            <h2 className="font-semibold mb-2 text-sm">Top Clinicians</h2>

            {topClinicians.length === 0 ? (
              <p className="text-gray-500">
                No clinicians activity in last month.
              </p>
            ) : (
              <ul className="space-y-2 overflow-y-auto">
                {topClinicians.map((clinician, index) => (
                  <li
                    key={clinician.id}
                    className="grid grid-cols-3 items-center border-b py-1 last:border-none w-full"
                  >
                    <span className="font-semibold text-gray-500 ">
                      #{index + 1}
                    </span>
                    <div className="flex flex-col ">
                      <p className="text-xs">{clinician.name}</p>
                      <span className="text-xs text-secondary">
                        {clinician.title}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-700 text-end">
                      {clinician.casesTaken} cases
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* On-demand Assessments */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 ">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold mb-2 text-sm">
                On-demand Assessments
              </h2>
              <button
                className="text-primary hover:text-opacity-50 text-xs font-medium"
                onClick={() => navigate("/assessment-questions/on-demand")}
              >
                View All →
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[200px]">
              {onDemandAssessmentsData.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between py-1 border-b last:border-none"
                >
                  <div className="flex items-center">
                    <div>
                      <h3 className="text-xs text-gray-900">
                        {assessment.name}
                      </h3>
                    </div>
                  </div>
                  {/* <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {assessment.questions.length} questions
                    </p>
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Monthly Assessments Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 h-fit">
            <h2 className="text-sm font-semibold mb-2">
              Monthly Assessments Completed
            </h2>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthlyAssessmentsData}
                    dataKey="assessments"
                    nameKey="month"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {monthlyAssessmentsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} assessments`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold mb-1">Popular Assessments</h2>

            <div className="divide-y max-h-[200px] overflow-y-auto">
              {assessmentCategories
                .filter((a) => a.enabled)
                .map((assessment) => (
                  <div key={assessment.id} className="py-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium">
                        {assessment.name}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 mt-1">
                      <div
                        className="bg-[#1e7d6d] h-1"
                        style={{
                          width: `${(assessment.price / 100) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
            <h2 className="text-sm font-semibold mb-4">
              Monthly Platform Growth
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="New Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="clinicians"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="New Clinicians"
                  />
                  <Area
                    type="monotone"
                    dataKey="assessments"
                    stackId="3"
                    stroke="#ffc658"
                    fill="#ffc658"
                    name="Assessments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">
                Revenue & Commissions
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenuePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {revenuePieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>*/}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
