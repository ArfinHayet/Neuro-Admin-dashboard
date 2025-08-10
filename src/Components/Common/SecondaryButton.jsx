const SecondaryButton = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`border border-[#0A6876]  text-[#0A6876] rounded-lg ${className}`}
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
