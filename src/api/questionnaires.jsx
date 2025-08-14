import { domain } from "../../credential";


const addQuestion = async (obj) => {
  const response = await fetch(`${domain}/questionnaires`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  const data = await response.json();
  return data;
};


const getQuestionsByAssessmentId = async (assessmentId) => {
  const response = await fetch(`${domain}/questionnaires?assessmentId=${assessmentId}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};


const updateQuestion = async (id, obj) => {
  const response = await fetch(`${domain}/questionnaires/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
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
    },
  });

  const data = await response.json();
  return data;
};

export { addQuestion, getQuestionsByAssessmentId, updateQuestion, deleteQuestion };
