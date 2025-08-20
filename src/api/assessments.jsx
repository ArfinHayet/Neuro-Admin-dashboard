import { domain } from "../../credential";
import { token } from "../Components/utils/token";

export async function createAssessment(obj) {
console.log(obj)
    const res = await fetch(`${domain}/assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

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
  return data;

}
