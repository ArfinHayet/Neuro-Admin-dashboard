import { useState } from "react";
import { NavLink } from "react-router-dom";
import { navItem } from "../Components/utils/navItem";
import Dropdown from "./Dropdown";

const Sidebar = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const toggleDropdown = (index) =>
    setOpenDropdownIndex((prev) => (prev === index ? null : index));

  const today = new Date();
  const dayName = today.toLocaleDateString("en-GB", { weekday: "long" });
  const date = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
  });
  const year = today.getFullYear();

  return (
    <div className="h-screen pt-20 ps-0 pe-2 bg-[#F6F7F9] w-full ">
      <div className="mb-8 space-y-1">
        <hr className="text-[#E9E9E9] " />
        <div className=" text-primary leading-5 ps-4 ">
          <p className=" text-sm">{dayName}</p>
          <p className="text-3xl font-medium text-[#3B3B3B]">{date}</p>
          <p className="text-sm">{year}</p>
        </div>
        <hr className="text-[#E9E9E9] " />
      </div>
      <ul>
        {navItem.map((item, index) => {
          const hasDropdown = item.routes && item.routes.length > 0;
          const Icon = item.icon;

          if (hasDropdown) {
            return (
              <Dropdown
                key={index}
                title={item.title}
                icon={item.icon}
                routes={item.routes}
                isOpen={openDropdownIndex === index}
                onToggle={toggleDropdown}
                index={index}
              />
            );
          }

          return (
            <li key={index} className="my-2">
              <NavLink
                to={item.path || "#"}
                className={({ isActive }) =>
                  `w-full py-2 ps-4 text-sm flex items-center justify-start gap-2 transition-all border-l-4 ${
                    isActive
                      ? "text-[#114654] border-[#114654] font-bold bg-transparent"
                      : "text-[#6C6C6C] border-transparent hover:text-[#114654] font-medium"
                  }`
                }
              >
                {Icon && typeof Icon === "string" ? (
                  <img src={Icon} alt={item.title} className="w-5 h-5 " />
                ) : (
                  Icon && <Icon className="text-lg" color="currentColor" />
                )}
                <span>{item.title}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
