// import { useState } from "react";

// const DynamicInputFields = () => {
//   const [fields, setFields] = useState([""]); // Initialize with one input

//   const handleAddField = () => {
//     setFields([...fields, ""]); // Add a new empty field
//   };

//   const handleChange = (index, value) => {
//     const newFields = [...fields];
//     newFields[index] = value;
//     setFields(newFields);
//   };

//   return (
//     <div className="p-4">
//       {fields.map((field, index) => (
//         <input
//           key={index}
//           type="text"
//           value={field}
//           onChange={(e) => handleChange(index, e.target.value)}
//           className="block w-full p-2 mb-2 border rounded"
//           placeholder={`Field ${index + 1}`}
//         />
//       ))}
//       <button
//      type="button"
//         onClick={handleAddField}
//         className="px-4 py-2 text-white bg-blue-500 rounded"
//       >
//         Add Field
//       </button>
//     </div>
//   );
// };

// export default DynamicInputFields;


import { useState } from "react";

const DynamicInputFields = () => {
  const [fields, setFields] = useState([""]); // Initialize with one input

  const handleAddField = () => {
    setFields([...fields, ""]); // Add a new empty field
  };

  const handleChange = (index, value) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index); // Remove selected field
    setFields(newFields);
  };

  return (
    <div className="p-4">
      {fields.map((field, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            value={field}
            onChange={(e) => handleChange(index, e.target.value)}
            className="block w-full p-2 border rounded"
            placeholder={`Field ${index + 1}`}
          />
          <button
            onClick={() => handleRemoveField(index)}
            className="ml-2 px-3 py-2 bg-red-500 text-white rounded"
          >
            ❌
          </button>
        </div>
      ))}
      <button
      type="button"
        onClick={handleAddField}
        className="px-4 py-2 text-white bg-blue-500 rounded"
      >
        Add Field
      </button>
    </div>
  );
};

export default DynamicInputFields;
