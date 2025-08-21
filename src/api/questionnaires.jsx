import { domain } from "../../credential";
import { token } from "../Components/utils/token";


const addQuestion = async (obj) => {
  console.log(obj)
  const response = await fetch(`${domain}/questionnaires`, {
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


const getQuestionsByAssessmentId = async (assessmentId) => {
  const response = await fetch(`${domain}/questionnaires?assessmentId=${assessmentId}`, {
    method: "GET",
     headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};


const getAllQuestions = async () => {
  const response = await fetch(`${domain}/questionnaires`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
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

  const data = await response.json();
  return data;
};


const deleteQuestion = async (id) => {
  const response = await fetch(`${domain}/questionnaires/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
            authorization: `Bearer ${token}`,

    },
  });

  const data = await response.json();
  return data;
};

export { addQuestion,getAllQuestions, getQuestionsByAssessmentId, updateQuestion, deleteQuestion };