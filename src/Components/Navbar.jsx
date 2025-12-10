
import { useContext } from "react";
import { AuthContext } from "./AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";
import p3 from "../../public/png/heading.png"

const Navbar = () => {
  const { userData,handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("kkkkk",userData)


  const Logout = () => {
    handleLogout();
    navigate("/login");
  };

  const toInitials = (str) =>{
     if (!str) return "";
  return str
    .trim()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2); 
};

  return (
    <div className="navbar bg-[#F6F7F9] px-7">
      <div className="flex-1 gap-[7.5rem]">
        <a href="/">
          <img height={300} className="h-[34px] -ml-2.5" src={p3} alt="logo" />
        </a>
      </div>
      <div className="flex-none">
        <div className="flex gap-2 dropdown dropdown-end">
          <div className="flex flex-col justify-end items-end">
            <p className="text-[#3B3B3B] text-sm font-bold">
              {userData?.userData?.name}
            </p>
            <p className="text-[#959595] text-xs font-semibold">
              {userData?.userData?.designation}
            </p>
          </div>
       
          <div tabIndex={0} role="button" className="">
            <div className="rounded-full p-2 text-sm font-bold border border-gray-400 hover:bg-gray-200 hover:shadow-lg">
              <p>{toInitials(`${userData?.name}`)}</p>
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-xl mt-14 w-48 p-2 shadow-xl"
          >
            <div className="text-sm p-3 ">
              <h1 className="text-[#3B3B3B] font-bold">{userData?.name}</h1>
              <h1 className="text-[#3B3B3B] font-bold">{userData?.role}</h1>

              <button onClick={Logout}>Logout</button>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
