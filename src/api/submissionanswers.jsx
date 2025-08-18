import { domain } from "../../credential";
import { token } from "../Components/utils/token";

//submission api

export const addSubmission = async (obj ) => {

    const res = await fetch(`${domain}/api/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),          // obj = { patientId, assessmentId, userId, score, summary }
    })


     const data = await res.json();
     return data;
};


export const getSubmissions = async () => {
  
    const res = await fetch(`${domain}/submissions`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

 const data = await res.json();
 return data;
};

export const deleteSubmission = async (id) => {
  
    const res = await fetch(`${domain}/submissions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
     const data = await res.json();
 return data;
};



//answers api 

export const addAnswer = async (obj) => {
    const res = await fetch(`${domain}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),                    // obj = { questionId, userId, patientId, answer, assessmentId }
    });

     const data = await res.json();
 return data;
};

export const getAnswers = async () => {
 
    const res = await fetch(`${domain}/answers`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
 return data;
};

export const deleteAnswer = async (id) => {

    const res = await fetch(`${domain}/answers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
 return data;
};
