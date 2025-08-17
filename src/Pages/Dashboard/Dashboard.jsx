import React from "react";
import {
  onDemandAssessments,
  users,
  clinicians,
  assessments,
  transactionLogs,
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
} from "recharts";
import Stats from "./Stats";

const Dashboard = () => {
  // === Logic Functions ===

  const filterLast30Days = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  };

  const newUsersLast30Days = users.filter((user) =>
    filterLast30Days(user.createdAt)
  );

  const newCliniciansLast30Days = clinicians.filter((c) =>
    filterLast30Days(c.createdAt)
  );

  const activeClinicians = clinicians.filter((c) => c.status === "active");

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const recentAssessments = assessments.filter((a) => {
    if (!a.dateTaken) return false;
    const dateTaken = new Date(a.dateTaken);
    const diffDays = (Date.now() - dateTaken.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  });

  // Charts data
  const monthlyAssessmentsData = [
    { month: "Jun", assessments: 12 },
    { month: "Jul", assessments: 18 },
    { month: "Aug", assessments: assessments.length },
  ];

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
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] p-2 ">
      <div className="bg-white p-2 rounded-md h-[88vh] overflow-y-auto">
        <h1 className="text-xl font-semibold mb-0">Dashboard</h1>
        <p className="text-sm mb-4 text-secondary">
          Get an overview of your platform’s performance, user engagement, and
          clinician activity.
        </p>
        <div className="mb-4">
          <Stats />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold mb-4">
                  On-demand Assessments
                </h2>{" "}
                <button className="text-primary hover:text-opacity-50 text-xs font-medium">
                  View All Assessments →
                </button>
              </div>
              <div className="space-y-4">
                {onDemandAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between py-0.5 border-b last:border-none rounded-lg "
                  >
                    <div className="flex items-center">
                      <div>
                        <h3 className=" text-gray-900">{assessment.title}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {assessment.questions.length} questions •{" "}
                        {assessment.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 ">
              <h2 className="text-lg font-semibold mb-4">
                Revenue & Commissions
              </h2>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 ">
              <h2 className="text-lg font-semibold mb-4">
                Monthly Assessments Completed
              </h2>
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

            {/* New Assessments Section */}
            <section className="bg-white p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-1">
                Ongoing On-demand Assessments
              </h2>
              {recentAssessments.length === 0 ? (
                <p>No new assessments in the last 30 days.</p>
              ) : (
                <ul>
                  {recentAssessments.map(
                    ({ id, name, userId, dateTaken, status }) => (
                      <li
                        key={id}
                        className="flex justify-between items-center border-b last:border-none p-1 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <p className="text-sm">{name}</p>
                          <span className="text-xs text-secondary">
                            By: {getUserName(userId)} | Date: {dateTaken}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {status === "completed" ? "Completed" : "Pending"}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </section>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Active Clinicians Section */}
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-1">Active Clinicians</h2>
              {activeClinicians.length === 0 ? (
                <p className="text-gray-500">No active clinicians found.</p>
              ) : (
                <ul>
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
                        <p className="text-sm">{clinician.name}</p>
                        <p className="text-xs text-secondary">
                          {clinician.title}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            {/* New Users & New Clinicians */}
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-base font-medium mb-1">
                New Users <span className="text-sm">(Last 30 Days)</span>
              </h2>
              {newUsersLast30Days.length === 0 ? (
                <p className="text-gray-500">
                  No new users in the last 30 days.
                </p>
              ) : (
                <ul>
                  {newUsersLast30Days.map((user) => (
                    <li
                      key={user.id}
                      className="border-b py-2 last:border-none"
                    >
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-secondary">{user.email}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-base font-medium mb-1">
                New Clinicians <span className="text-sm">(Last 30 Days)</span>
              </h2>
              {newCliniciansLast30Days.length === 0 ? (
                <p className="text-gray-500">
                  No new clinicians in the last 30 days.
                </p>
              ) : (
                <ul>
                  {newCliniciansLast30Days.map((clinician) => (
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
                        <p className="text-sm">{clinician.name}</p>
                        <p className="text-xs text-secondary">
                          {clinician.title}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>{" "}
      </div>
    </section>
  );
};

export default Dashboard;
