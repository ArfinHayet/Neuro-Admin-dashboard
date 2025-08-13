const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export async function createAssessment(name, description, type) {
  try {
    const res = await fetch(`${BASE_URL}/assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: String(name),
        description: String(description),
        type: String(type), 
      }),
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
    const res = await fetch(`${BASE_URL}/assessments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch assessments");
    return await res.json();
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
}

