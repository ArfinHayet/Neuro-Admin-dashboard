import { domain } from "../../credential";
import { token } from "../Components/utils/token";

export async function createAssessment(obj) {
  try {
    const res = await fetch(`${domain}/api/assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    if (!res.ok) throw new Error("Failed to create assessment");
    return await res.json();
  } catch (error) {
    console.error("Error creating assessment:", error);
    throw error;
  }
}

export async function getAssessments() {
  try {
    const res = await fetch(`${domain}/api/assessments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch assessments");
    return await res.json();
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
}
