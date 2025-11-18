import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const getProducts = async () => {
  const response = await fetch(`${domain}/payment/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token()}`,
    },
  });

  const data = await response.json();
  return data;
};

export { getProducts };
