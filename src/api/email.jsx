import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const sendEmail = async (obj) => {
  const response = await fetch(`${domain}/mail/send`, {
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

export { sendEmail };
