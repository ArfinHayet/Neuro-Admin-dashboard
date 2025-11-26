import { domain } from "../../credential";
import { token } from "../Components/utils/token";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${domain}/upload`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`, 
    },
    body: formData,
  });

  const data = await response.json();
  return data; // expect { filename: "uploadedFile.jpg" }
};

export { uploadFile };
