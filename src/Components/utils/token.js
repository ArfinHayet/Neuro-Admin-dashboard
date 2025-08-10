export const isAuthenticated = () => {
 const accessToken = localStorage.getItem("accessToken");

// const role = localStorage.getItem("role");
 return accessToken;
};



// const isAuthenticated = () => {
//   const accessToken = localStorage.getItem("accessToken");

//   // const role = localStorage.getItem("role");
//   return accessToken ;
// };

// export default {isAuthenticated}


