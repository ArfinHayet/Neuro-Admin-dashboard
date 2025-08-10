
const Text = ({ label, value }) => {
  return (
    <p className="flex flex-col gap-1">
      <span className="text-[#959595] text-sm font-medium">{label}</span>
      <span className="text-[#333333] text-sm font-medium">{value}</span>
    </p>
  );
};

export default Text;
