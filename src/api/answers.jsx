import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const createAnswer = async (obj) => {
  console.log(obj);
  const response = await fetch(`${domain}/answers`, {
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

const getAllAnswers = async () => {
  const response = await fetch(`${domain}/answers`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token()}`,
    },
  });

  const data = await response.json();
  return data;
};

const getAnswersByAssessmentId = async (assessmentId) => {
  let page = 1;
  let limit = 100;
  let allAnswers = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${domain}/answers?assessmentId=${assessmentId}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token()}`,
        },
      }
    );

    const data = await response.json();
    if (Array.isArray(data.payload) && data.payload.length > 0) {
      allAnswers = [...allAnswers, ...data.payload];
      page++;
    } else {
      hasMore = false;
    }
  }

  return { payload: allAnswers };

};

// ✅ Now supports both patientId and assessmentId together
const getAnswersByPatientAndAssessment = async (patientId, assessmentId) => {
  const response = await fetch(
    `${domain}/answers?patientId=${patientId}&assessmentId=${assessmentId}`,
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

export {
  createAnswer,
  getAllAnswers,
  getAnswersByAssessmentId,
  getAnswersByPatientAndAssessment,
};
