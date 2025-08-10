const Tab = ({ tabs, selected, setSelected }) => {
  return (
    <div>
      <div className="flex flex-row gap-10 border-b border-gray-300  ">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelected(tab)}
            className={`pb-2 text-xs font-medium transition-colors duration-200 ${
              selected === tab
                ? "text-[#0A6876] border-b-2 border-[#0A6876]"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tab;
