import { domain } from "../../credential";
import { token } from "../Components/utils/token";

// create new submission
const createSubmission = async (obj) => {
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

// fetch one page (paged API)
const getSubmissionsPage = async (page = 1, limit = 20) => {
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
  return data;
};

// fetch ALL submissions across all pages
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
    if (!Array.isArray(data.payload) || data.payload.length === 0) break;

    allSubmissions = [...allSubmissions, ...data.payload];
    page += 1;
  }

  return { payload: allSubmissions };
};

export { createSubmission, getSubmissionsPage, getAllSubmissions };
