import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const addPatient = async (obj) => {
  const response = await fetch(`${domain}/patient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  });

  const data = await response.json();
  return data;
};

const getPatients = async () => {
  const response = await fetch(`${domain}/patient`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

const getPatientById = async (id) => {
  const response = await fetch(`${domain}/patient/${id}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

const updatePatient = async (id, obj) => {
  const response = await fetch(`${domain}/patient/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  });

  const data = await response.json();
  return data;
};

const deletePatient = async (id) => {
  const response = await fetch(`${domain}/patient/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

export {  addPatient, getPatients, getPatientById, updatePatient, deletePatient };
