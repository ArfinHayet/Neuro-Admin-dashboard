import { domain } from "../../credential";
import { token } from "../Components/utils/token";
import { compressFile } from "./compressfile";

const uploadFile = async (file) => {
  // Compress before upload
  const compressedFile = await compressFile(file, 1); // max 1MB

  const formData = new FormData();
  formData.append("file", compressedFile);

  const response = await fetch(`${domain}/upload`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token()}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data;
};

export { uploadFile };
