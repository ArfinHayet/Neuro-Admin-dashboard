import { useContext, useState } from "react";
import p1 from "../../../../public/png/heading.png";
import { MdRemoveRedEye } from "react-icons/md";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../../../Components/AuthProvider/AuthProvider";
import {  login } from "../../../api/user";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setLoading, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

   const handleLogInUser = async (event) => {
    event.preventDefault();
    
    const form = event.target;

    const email = form.email?.value || "";
    const password = form.password?.value || "";

    const postdetails = {
      identifier: email,
      password,
    };

   
      setLoading(true);
      const result = await login(postdetails);

      if (result && result?.payload?.token?.access_token) {
        localStorage.setItem("accessToken", result.payload.token.access_token);
            const token = result.payload.token.access_token;

        const userData = {
          ...result.payload.filteredUser,
          token,
        };
        setUserData(userData);
        setLoading(false);
        navigate("/");
      }
    
  };


  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <form
        className="w-[381px] max-w-sm h-[530px] bg-white border rounded-xl px-[38px] pt-9 pb-8 mb-4"
        onSubmit={handleLogInUser}
      >
       <div className="flex items-center justify-center"><img className=" h-[40px] " src={p1} alt="Logo" />
        </div>
        <h1 className="font-semibold text-lg mb-2 mt-6 text-[#3B3B3B]">
          User Login
        </h1>
        <hr className=" mb-9 px-9" />

        <div className="mb-6 w-[309px] h-[74px]">
          <label
            className="block text-[#6C6C6C] text-sm font-normal mb-2"
            htmlFor="phone"
          >
            Username / Mobile Number
          </label>
          <input
            className="border outline-none bg-[#F7F7F7] rounded w-[309px] h-[47px] px-3 "
            id="user_name"
            name="email"
            type="text"
            required
          />
        </div>

        <div className="mb-2 w-[309px] h-[74px] relative">
          <label
            className="block text-[#6C6C6C] text-sm font-normal mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="border outline-none bg-[#F7F7F7] rounded w-[309px] h-[47px] px-3 "
            id="password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            required
          />
          <div
            className="absolute right-3 top-[53px] text-xl transform -translate-y-1/2 cursor-pointer text-[#979797]"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <AiFillEyeInvisible /> : <MdRemoveRedEye />}
          </div>
        </div>

        <button
          //   onClick={onOpenModal}
          className="ml-[12.25rem] pb-3 mb-7 underline text-right text-[#959595] text-xs font-medium"
        >
          Forgot Password?
        </button>

        <div>
          
          <button className="bg-gradient-to-r from-[#088395] to-[#0A6876] px-4 text-white rounded-lg text-xs w-full  font-medium  py-[2px]  h-[35px]">
            Login
          </button>
        </div>

        <div className="ml-2 mt-8">
          <p className="flex flex-row justify-center items-center px-4 gap-1">
            <span className="text-[#959595] text-[11px] font-normal mt-1">
              Powered by{" "}
            </span>
            <a href="https://mpairtech.com" target="_blank">
              <span className="text-[#000000] text-[11px] font-normal">
                mPair Technologies Ltd.
              </span>
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;