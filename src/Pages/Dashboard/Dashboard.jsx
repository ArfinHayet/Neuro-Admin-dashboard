import React from "react";
import Stats from "./Stats";

const Dashboard = () => {
  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 ">
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-sm mb-4 text-secondary">
        Get an overview of your platform’s performance, user engagement, and
        clinician activity.
      </p>

      <Stats />
    </section>
  );
};

export default Dashboard;
