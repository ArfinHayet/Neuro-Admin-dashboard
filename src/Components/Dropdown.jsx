import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Dropdown = ({ title, icon, routes, isOpen, onToggle, index }) => {
  return (
    <div>
      <div
        className="flex items-center justify-between py-2 cursor-pointer w-full"
        onClick={() => onToggle(index)}
      >
        <div className="flex gap-3 px-4">
          <img
            src={icon}
            height={300}
            className="h-[16px] object-contain mt-1"
            alt="icon"
          />
          <span className="text-sm text-[#6C6C6C] font-medium">{title}</span>
        </div>
        <span className="text-2xl ml-auto text-[#6C6C6C]">
          {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </span>
      </div>
      {isOpen && (
        <div className="pl-6 flex flex-col gap-4">
          {routes.map((route, i) => (
            <li key={i}>
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#ececec] px-2  py-1 rounded-2xl text-sm font-medium  text-[#0A6876]"
                    : "text-[#959595] px-2  py-1 text-sm font-medium"
                }
              >
                {route.label}
              </NavLink>
            </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
