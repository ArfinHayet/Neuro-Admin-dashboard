import { useState } from "react";
import { LuUpload } from "react-icons/lu";

const FileInput = ({ label, name, onChange, accept, className}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      {!file ? (
        <label
          title="Click to upload"
          htmlFor={name}
          className="cursor-pointer bg-white  border border-[#EAEAEA] rounded-md flex flex-row  justify-between px-2 py-[8px]"
        >
          <span className="text-xs font-medium text-[#959595]">Select image</span>
          <span>
            <LuUpload className="text-sm text-[#959595]" />
          </span>
        </label>
      ) : (
        <p className="text-sm text-gray-600 border  px-2 py-[10px] border-[#EAEAEA] rounded-md ">{file.name}</p>
      )}

      <input    
        hidden
        type="file"
        accept={accept}
        onChange={handleFileChange}
        name={name}
        id={name}
      />
    </div>
  );
};

export default FileInput;
