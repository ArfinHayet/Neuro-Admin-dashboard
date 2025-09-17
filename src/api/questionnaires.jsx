import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const addQuestion = async (obj) => {
  const response = await fetch(`${domain}/questionnaires`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  });

  return await response.json();
};

const getQuestionsByAssessmentId = async (assessmentId) => {
  let page = 1;
  let limit = 100; // adjust if needed
  let allQuestions = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${domain}/questionnaires?assessmentId=${assessmentId}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (Array.isArray(data.payload) && data.payload.length > 0) {
      allQuestions = [...allQuestions, ...data.payload];
      page++;
    } else {
      hasMore = false;
    }
  }

  return { payload: allQuestions };
};

const getAllQuestions = async () => {
  let page = 1;
  let limit = 100;
  let allQuestions = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${domain}/questionnaires?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (Array.isArray(data.payload) && data.payload.length > 0) {
      allQuestions = [...allQuestions, ...data.payload];
      page++;
    } else {
      hasMore = false;
    }
  }

  return { payload: allQuestions };
};

const updateQuestion = async (id, obj) => {
  const response = await fetch(`${domain}/questionnaires/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  });

  return await response.json();
};

const deleteQuestion = async (id) => {
  const response = await fetch(`${domain}/questionnaires/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

export { addQuestion, getAllQuestions, getQuestionsByAssessmentId, updateQuestion, deleteQuestion };
