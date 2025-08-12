import { useState } from "react";
import AssessmentPricing from "./AssessmentPricing";
import ClinicianCommission from "./ClinicianCommission";
import TransactionLogs from "./TransactionLogs";

const tabs = [
  { id: "pricing", label: "Assessment Pricing" },
  { id: "commissions", label: "Clinician Commissions" },
  { id: "transactions", label: "Transaction Logs" },
];

export default function Finances() {
  const [activeTab, setActiveTab] = useState("pricing");

  const renderTabContent = () => {
    switch (activeTab) {
      case "pricing":
        return <AssessmentPricing />;
      case "commissions":
        return <ClinicianCommission />;
      case "transactions":
        return <TransactionLogs />;
      default:
        return null;
    }
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <h1 className="text-2xl font-semibold mb-1">Finance</h1>
      <p className="text-sm mb-8 text-secondary">
        Manage your platform's pricing, clinician commissions, and transaction history in one place.
      </p>

      <div className="flex gap-8 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-3 font-medium text-sm ${
              activeTab === tab.id
                ? "text-primary font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        {renderTabContent()}
      </div>
    </section>
  );
}