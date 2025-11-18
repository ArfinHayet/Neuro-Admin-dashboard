import { domain } from "../../credential";
import { token } from "../Components/utils/token";

// Add new question category
const addQuestionCategory = async (obj) => {
  const response = await fetch(`${domain}/question-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(obj),
  });

  return await response.json();
};

// Get all question categories (with pagination)
const getAllQuestionCategories = async () => {
  let page = 1;
  let limit = 100;
  let allCategories = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${domain}/question-categories?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token()}`,
        },
      }
    );

    const data = await response.json();

    if (Array.isArray(data.payload) && data.payload.length > 0) {
      allCategories = [...allCategories, ...data.payload];
      page++;
    } else {
      hasMore = false;
    }
  }

  return { payload: allCategories };
};

// Delete a question category by ID
const deleteQuestionCategory = async (id) => {
  if (!id) throw new Error("Category ID is required to delete.");

  const response = await fetch(`${domain}/question-categories/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token()}`,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to delete category (${response.status}): ${err}`);
  }

  return await response.json();
};

const updateQuestionCategory = async (id, obj) => {
  const response = await fetch(`${domain}/question-categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify(obj),
  });

  return await response.json();
};

export {
  addQuestionCategory,
  getAllQuestionCategories,
  deleteQuestionCategory,
  updateQuestionCategory,
};
