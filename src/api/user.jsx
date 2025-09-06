import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const addUser = async (obj) => {
  const response = await fetch(`${domain}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: obj.name,
      email: obj.email,
      password: obj.password,
      phone: obj.phone,
      age: obj.age,
      country: obj.country,
      state: obj.state,
      postCode: obj.postCode,
      street: obj.street,
      role: obj.role,
      knowHow: obj.knowHow,
      otp: obj.otp,
      identifier: obj.identifier,
    }),
  });

  const data = await response.json();
  //////console.log(data);

  return data;
};

const getUsers = async (page = 1, limit = 5 ) => {
  const response = await fetch(`${domain}/users?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};


const login = async (obj) => {
  // //console.log(obj);
  const response = await fetch(`${domain}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentials: 'include'
      // authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(obj),
  });

  const data = await response.json();
  // console.log("token generated", data);

  return data;
};



const deleteUser = async (id) => {
  const response = await fetch(`${domain}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  });

  const data = await response.json();
  return data;
};

const getUserById = async (id) => {
  const response = await fetch(`${domain}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

const getLeaves = async () => {
  const response = await fetch(`${domain}/leaves`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

const getAvailability = async () => {
  const response = await fetch(`${domain}/availabilities`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

 
export { addUser, getUsers, login, deleteUser, getUserById, getLeaves, getAvailability };


