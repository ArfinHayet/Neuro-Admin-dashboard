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


const getAllanswers = async ({ patientId, assessmentId }) => {
  let allData = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${domain}/answers?patientId=${Number(patientId)}&assessmentId=${assessmentId}&limit=100&page=${page}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    const data = await response.json();
    const payload = data?.payload || [];

    allData = [...allData, ...payload];

    if (payload.length < 100) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return { payload: allData };
};


export {
  createAnswer,
  getAllanswers,
  getAnswersByAssessmentId,
};
