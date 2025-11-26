import { domain } from "../../credential";
import { token } from "../Components/utils/token";


// fetch one page (paged API)
const getAppointmentsPage = async (page = 1, limit = 20) => {
  const response = await fetch(
    `${domain}/appointments?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token()}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

// fetch ALL submissions across all pages
const getAllAppointments = async () => {
  let allAppointments = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `${domain}/appointments?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token()}`,
        },
      }
    );

    const data = await response.json();
    if (!Array.isArray(data.payload) || data.payload.length === 0) break;

    allAppointments = [...allAppointments, ...data.payload];
    page += 1;
  }

  return { payload: allAppointments };
};

export { getAppointmentsPage, getAllAppointments };
