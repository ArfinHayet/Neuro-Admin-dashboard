
const Header = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-lg font-medium text-[#333333]">{title}</p>
      <p className="text-sm text-[#6C6C6C]">{subtitle}</p>
    </div>
  );
};

export default Header;
