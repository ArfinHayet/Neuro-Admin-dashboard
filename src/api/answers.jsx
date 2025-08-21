import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const createAnswer = async (obj) => {
  console.log(obj);
  const response = await fetch(`${domain}/answers`, {
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

const getAllAnswers = async () => {
  const response = await fetch(`${domain}/answers`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

const getAnswersByAssessmentId = async (assessmentId) => {
  const response = await fetch(`${domain}/answers?assessmentId=${assessmentId}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

export { createAnswer, getAllAnswers, getAnswersByAssessmentId };
