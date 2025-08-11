import { useState } from "react";
import AssessmentPricing from "../../Components/FInance/AssessmentPricing";
import ClinicianCommission from "../../Components/FInance/ClinicianCommission";
import TransactionLogs from "../../Components/FInance/TransactionLogs";

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
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 ">
      <h1 className="text-2xl font-semibold mb-1">Finance </h1>
      <p className="text-sm mb-4 text-secondary">Manage your platform’s pricing, clinician commissions, and transaction history in one place.</p>

      <div className="flex gap-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border"
            }`}
          >
            {tab.label}
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
