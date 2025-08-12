// import p1 from "../../public/png/logo.png";
import { useContext } from "react";
//import p1 from "../../public/png/logo.svg";
//import p2 from "../../public/png/profile.png";
import { AuthContext } from "./AuthProvider/AuthProvider";
import { Navigate } from "react-router-dom";
//import m1 from "../../public/png/message.png";
//import n1 from "../../public/png/notification.png";
import p3 from "../../public/png/heading.png"

const Navbar = () => {
  const { userData,handleLogout } = useContext(AuthContext);
  console.log("kkkkk",userData)


  const Logout = () => {
    handleLogout();
    Navigate("/login");
  };

  const toInitials = str => 
    str
      
     .split(" ") 
     .map(c => c.charAt(0).toUpperCase()).join("").concat(str.charAt(1).toUpperCase())
     .substring(0, 2);


  return (
    <div className="navbar bg-white px-7">
      <div className="flex-1 gap-[7.5rem]">
        <a href="/dashboard">
          <img height={300} className="h-[30px]" src={p3} alt="logo" />
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
         {/* <div className="flex gap-4 justify-center items-center me-3">
            <img src={m1} height={20} width={20} className="h-[22px]" />
            <img src={n1} height={20} width={20} className="h-[24px]" />
          </div>*/}
          <div tabIndex={0} role="button" className="btn btn-sm  btn-circle">
            <div className="rounded-full p-2 text-xs border border-gray-400">
              <p>{toInitials(`${userData?.userData?.name}`)}</p>
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-xl mt-14 w-48 p-2 shadow-xl"
          >
            <div className="text-sm p-3 ">
              {/* <h1 className="text-[#3B3B3B] font-bold">hello</h1> */}

              <button onClick={Logout}>Logout</button>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
