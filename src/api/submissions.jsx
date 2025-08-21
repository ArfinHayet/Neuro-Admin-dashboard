import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const createSubmission = async (obj) => {
  console.log(obj);
  const response = await fetch(`${domain}/submissions`, {
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

const getAllSubmissions = async () => {
  const response = await fetch(`${domain}/submissions`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

export { createSubmission, getAllSubmissions };
