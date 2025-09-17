import React, { useState, useEffect } from "react";
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
import { getAllSubmissions } from "../../api/submissions";

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
  const [latestClinicians, setLatestClinicians] = useState([]);
  const [monthlyAssessmentsData, setMonthlyAssessmentsData] = useState([]);
  const [monthlyGrowthData, setMonthlyGrowthData] = useState([]);
  const [popularAssessments, setPopularAssessments] = useState([]);
  const [topClinicians, setTopClinicians] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(); // will fetch all users
        if (data && Array.isArray(data.payload)) {
          //  (exclude clinicians + admins)
          const filteredUsers = data.payload.filter(
            (user) => user.role !== "clinician" && user.role !== "admin"
          );

          // Clinicians
          const filteredClinicians = data.payload.filter(
            (user) => user.role === "clinician"
          );

          //  last 10 entries
          setLatestUsers(filteredUsers.slice(-10).reverse());
          setLatestClinicians(filteredClinicians.slice(-10).reverse());
        } else {
          console.error("Unexpected API response structure:", data);
          setLatestUsers([]);
          setLatestClinicians([]);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setLatestUsers([]);
        setLatestClinicians([]);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getAllSubmissions();
        if (data && Array.isArray(data.payload)) {
          // Group by month-year
          const counts = {};
          data.payload.forEach((item) => {
            if (item.createdAt) {
              const date = new Date(item.createdAt);
              const monthYear = date.toLocaleString("default", {
                month: "short",
                year: "numeric",
              });
              counts[monthYear] = (counts[monthYear] || 0) + 1;
            }
          });

          // Convert to chart-friendly format
          const formattedData = Object.entries(counts).map(
            ([month, count]) => ({
              month,
              assessments: count,
            })
          );

          setMonthlyAssessmentsData(formattedData);
        } else {
          setMonthlyAssessmentsData([]);
        }
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        setMonthlyAssessmentsData([]);
      }
    };

    fetchSubmissions();
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

  useEffect(() => {
    const fetchPopularAssessments = async () => {
      try {
        const submissionsData = await getAllSubmissions();
        const submissions = Array.isArray(submissionsData?.payload)
          ? submissionsData.payload
          : [];

        // Group by assessment.id
        const counts = {};
        submissions.forEach((sub) => {
          if (sub.assessment?.id) {
            const id = sub.assessment.id;
            if (!counts[id]) {
              counts[id] = {
                id,
                name: sub.assessment.name,
                count: 0,
              };
            }
            counts[id].count += 1;
          }
        });
        const result = Object.values(counts);
        result.sort((a, b) => b.count - a.count);
        setPopularAssessments(result);
      } catch (err) {
        console.error("Failed to fetch popular assessments:", err);
        setPopularAssessments([]);
      }
    };

    fetchPopularAssessments();
  }, []);

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const [usersData, submissionsData] = await Promise.all([
          getUsers(),
          getAllSubmissions(),
        ]);

        const users = Array.isArray(usersData?.payload)
          ? usersData.payload
          : [];
        const submissions = Array.isArray(submissionsData?.payload)
          ? submissionsData.payload
          : [];

        const counts = {};

        users.forEach((user) => {
          if (user.createdAt) {
            const date = new Date(user.createdAt);
            const monthYear = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });
            if (!counts[monthYear]) {
              counts[monthYear] = { users: 0, clinicians: 0, assessments: 0 };
            }
            if (user.role === "clinician") {
              counts[monthYear].clinicians += 1;
            } else {
              counts[monthYear].users += 1;
            }
          }
        });

        // Count submissions by month
        submissions.forEach((sub) => {
          if (sub.createdAt) {
            const date = new Date(sub.createdAt);
            const monthYear = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });
            if (!counts[monthYear]) {
              counts[monthYear] = { users: 0, clinicians: 0, assessments: 0 };
            }
            counts[monthYear].assessments += 1;
          }
        });

        // Convert to chart data
        const formattedData = Object.entries(counts).map(([month, values]) => ({
          month,
          users: values.users,
          clinicians: values.clinicians,
          assessments: values.assessments,
        }));

        // Sort chronologically
        formattedData.sort(
          (a, b) => new Date("1 " + a.month) - new Date("1 " + b.month)
        );

        setMonthlyGrowthData(formattedData);
      } catch (err) {
        console.error("Failed to fetch growth data:", err);
        setMonthlyGrowthData([]);
      }
    };

    fetchGrowthData();
  }, []);

  useEffect(() => {
    const fetchTopClinicians = async () => {
      try {
        const data = await getAllSubmissions();
        if (data && Array.isArray(data.payload)) {
          const clinicianCounts = {};
          data.payload.forEach((s) => {
            if (s.clinicianId) {
              if (!clinicianCounts[s.clinicianId]) {
                clinicianCounts[s.clinicianId] = {
                  clinician: s.user, // from submission payload
                  count: 0,
                };
              }
              clinicianCounts[s.clinicianId].count += 1;
            }
          });

          // sort by count desc
          const sorted = Object.values(clinicianCounts).sort(
            (a, b) => b.count - a.count
          );

          setTopClinicians(sorted);
        } else {
          setTopClinicians([]);
        }
      } catch (err) {
        console.error("Failed to fetch top clinicians:", err);
        setTopClinicians([]);
      }
    };

    fetchTopClinicians();
  }, []);

  const COLORS = ["#82ca9d", "#ffc658"];

  return (
    <section className="pb-4">
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
          {/* New Clinicians */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-[53vh] ">
            <div className="flex justify-between items-start">
              <h2 className="text-sm font-semibold ">New Clinicians</h2>
              <button
                className="text-primary hover:text-opacity-50 text-xs font-medium"
                onClick={() => navigate("/clinicians")}
              >
                View All →
              </button>
            </div>
            {latestClinicians.length === 0 ? (
              <p className="text-gray-500">No clinicians found.</p>
            ) : (
              <ul className="overflow-y-auto h-[400px]">
                {latestClinicians.map((clinician) => (
                  <li
                    key={clinician.id}
                    className="border-b py-2 last:border-none flex items-center gap-3"
                  >
                    <div>
                      <p className="text-xs">{clinician.name}</p>
                      <p className="text-xs text-secondary">
                        {clinician.email}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* new users */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-[53vh] overflow-hidden">
            <div className="flex justify-between items-start">
              <h2 className="text-sm font-semibold ">New Users</h2>
              <button
                className="text-primary hover:text-opacity-50 text-xs font-medium"
                onClick={() => navigate("/patients")}
              >
                View All →
              </button>
            </div>
            {latestUsers.length === 0 ? (
              <p className="text-gray-500">No new users found.</p>
            ) : (
              <ul className="overflow-y-auto h-[400px]">
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
          {/* Top Clinicians by Submissions in 30 days */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-[53vh]">
            <h2 className="font-semibold mb-2 text-sm">Top Clinicians</h2>

            {topClinicians.length === 0 ? (
              <p className="text-gray-500">No clinician submissions found.</p>
            ) : (
              <ul className="space-y-2 h-[400px] overflow-y-auto">
                {topClinicians.map((entry, index) => (
                  <li
                    key={index}
                    className="grid grid-cols-3 items-center border-b py-1 last:border-none w-full"
                  >
                    <span className="font-semibold text-gray-500">
                      #{index + 1}
                    </span>
                    <div className="flex flex-col">
                      <p className="text-xs">
                        {entry.clinician?.name || "Unknown"}
                      </p>
                      <span className="text-xs text-secondary">
                        {entry.clinician?.email || ""}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-700 text-end">
                      {entry.count} assessments
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* On-demand Assessments */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-[53vh]">
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
            <div className="space-y-2 overflow-y-auto h-[300px]">
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
          <div className="bg-white p-4 rounded-lg border border-gray-200 h-[40vh]">
            <h2 className="text-sm font-semibold mb-2">
              Monthly Assessments Completed
            </h2>
            <div className="h-[250px]">
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
                    label={({ name }) => `${name}`}
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

          <div className="bg-white rounded-lg border border-gray-200 p-4 h-[24vh]">
            <h2 className="text-sm font-semibold mb-1">Popular Assessments</h2>
            <div className="divide-y max-h-[200px] overflow-y-auto">
              {popularAssessments.map((assessment) => (
                <div key={assessment.id} className="py-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-medium">
                      {assessment.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {assessment.count} submissions
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 mt-1">
                    <div
                      className="bg-[#1e7d6d] h-1"
                      style={{
                        width: `${
                          (assessment.count / popularAssessments[0].count) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200  h-[40vh]">
            <h2 className="text-sm font-semibold mb-2">
              Monthly Platform Growth
            </h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="95%">
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
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
