import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const createBanners = async (obj) => {
  const response = await fetch(`${domain}/banners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(obj),
  });

  const data = await response.json();
  return data;
};

const getAllBanners = async () => {
  const response = await fetch(`${domain}/banners`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token()}`,
    },
  });

  const data = await response.json();
  // ✅ return only the payload array
  return data.payload || [];
};




const deleteBanners = async (id) => {
  const response = await fetch(`${domain}/banners/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token()}`,
    },
  });
  const data = await response.json();

  return data;
};

export { createBanners, getAllBanners, deleteBanners };
