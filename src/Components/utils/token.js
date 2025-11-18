export const isAuthenticated = () => {
 const accessToken = localStorage.getItem("accessToken");

// const role = localStorage.getItem("role");
 return accessToken;
};

export const token = () => {
  return localStorage.getItem("accessToken");
};


// export const token = () => localStorage.getItem("accessToken");

// const isAuthenticated = () => {
//   const accessToken = localStorage.getItem("accessToken");

//   // const role = localStorage.getItem("role");
//   return accessToken ;
// };

// export default {isAuthenticated}

