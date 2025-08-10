import { domain } from "../../credential";

const addUser = async (obj) => {
  const response = await fetch(`${domain}/api/adduser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //       authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(obj),
  });

  const data = await response.json();
  //////console.log(data);

  return data;
};

const getUsers = async () => {
  const response = await fetch(`${domain}/api/user`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

const login = async (obj) => {
  // //console.log(obj);
  const response = await fetch(`${domain}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(obj),
  });

  const data = await response.json();
  // //console.log("token generated", data);

  return data;
};

const getAuthenticateUser = async (token) => {
  // console.log(token)
  const response = await fetch(`${domain}/api/user/user_info`, {
    method: "GET",
    headers: {
      // authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  // //console.log(data);
  return data;
};




const deleteUser = async (id) => {
  const response = await fetch(`${domain}/api/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  });

  const data = await response.json();
  return data;
};

export { addUser, getUsers,getAuthenticateUser,login,deleteUser };