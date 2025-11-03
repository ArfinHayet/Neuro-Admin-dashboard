import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="fixed h-[5vh] top-0 w-full z-10">
        <Navbar />
      </div>

      <div className="flex h-screen">
        <div className="fixed top-0 left-0 h-full w-[17%]">
          <Sidebar />
        </div>
        <div className="flex-1 px-4 mt-[9vh]  ml-[16%]  ">
          <div className="h-[90vh]  overflow-y-auto bg-white rounded-2xl px-4 pt-4">
            <Outlet /> 
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Layout;
