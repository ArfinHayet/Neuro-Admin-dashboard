import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const createBlog = async (obj) => {
  const response = await fetch(`${domain}/blogs`, {
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

const getAllBlogs = async () => {
  const response = await fetch(`${domain}/blogs`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  // ✅ return only the payload array
  return data.payload || [];
};

const deleteBlogs = async (id) => {
  const response = await fetch(`${domain}/blogs/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
   const data = await response.json();

  return data;
}

export { createBlog, getAllBlogs, deleteBlogs };
