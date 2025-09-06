import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const getPayments = async () => {
  try {
    const response = await fetch(`${domain}/payment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data; // { payload: [...] }
  } catch (err) {
    console.error("Error fetching payments:", err);
    return { payload: [] };
  }
};

const getPaymentById = async (id) => {
  try {
    const allPayments = await getPayments();
    const payment = (allPayments.payload || []).find(
      (p) => String(p.id) === String(id)
    );
    return payment || null;
  } catch (err) {
    console.error("Error fetching payment by ID:", err);
    return null;
  }
};

export { getPayments, getPaymentById };
