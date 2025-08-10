import { domain } from "../../credential";

const addRole = async (obj) => {
  const response = await fetch(`${domain}/api/role`, {
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

const getRoles = async () => {
  const response = await fetch(`${domain}/api/role`, {
    method: "GET",
    headers: {
      //       authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  const data = await response.json();
  //////console.log(data);
  return data;
};

const getSingleRole = async (id) => {
  const response = await fetch(`${domain}/api/role/${id}`, {
    method: "GET",
    headers: {
      //       authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  const data = await response.json();
  console.log(data);
  return data;
};

const updateRolePrivilege = async (obj) => {
  const response = await fetch(`${domain}/api/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      //     authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(obj),
  });

  const data = await response.json();
  console.log(data);
  return data;
};


const deleteRole = async (id) => {
  const response = await fetch(`${domain}/api/role/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  });

  const data = await response.json();
  return data;
};


export { addRole, getRoles, getSingleRole, updateRolePrivilege, deleteRole };
