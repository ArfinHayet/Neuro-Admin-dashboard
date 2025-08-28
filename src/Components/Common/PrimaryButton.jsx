const PrimaryButton = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r from-[#088395] to-[#0A6876] text-sm font-medium px-4 py-2 text-white rounded-lg ${className}`}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;