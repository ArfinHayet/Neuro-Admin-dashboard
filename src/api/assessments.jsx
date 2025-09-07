import { domain } from "../../credential";
import { token } from "../Components/utils/token";

export async function createAssessment(obj) {
  console.log(obj);
  const res = await fetch(`${domain}/assessments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export async function getAssessments() {
  const res = await fetch(`${domain}/assessments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log("Fetched assessments:", data);
  return data;
}

export async function deleteAssessment(id) {
  console.log(id)
  const res = await fetch(`${domain}/assessments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  console.log("deleted assessment:", data);

  return data;
}

export async function getAssessmentById(id) {
  try {
    const all = await getAssessments();
    return (all.payload || []).find((a) => String(a.id) === String(id)) || null;
  } catch (err) {
    console.error("Error fetching assessment by ID:", err);
    return null;
  }
}
