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
  let allSubmissions = [];
  let page = 1;
  const limit = 100; 

  while (true) {
    const response = await fetch(
      `${domain}/submissions?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!Array.isArray(data.payload) || data.payload.length === 0) {
      break; 
    }

    allSubmissions = [...allSubmissions, ...data.payload];
    page += 1;
  }

  return { payload: allSubmissions };
};


export { createSubmission, getAllSubmissions };
