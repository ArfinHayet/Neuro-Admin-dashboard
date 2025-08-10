
const StatusCard = ({ status, date, description }) => {
  return (
    <div className="bg-[#F5F5F5] p-2 rounded-xl">
      <p className="flex flex-row gap-2 mb-1 text-xs font-medium text-[#333333]">
        <span className="bg-[#3FC80036] px-3 py-1 rounded-xl">
          {status}
        </span>
        <span>{date}</span>
      </p>
      <p className="text-xs text-[#333333] text-justify">
        {description}
      </p>
    </div>
  );
};

export default StatusCard;
