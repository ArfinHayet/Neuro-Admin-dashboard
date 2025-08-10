// import { useState } from "react";

// const MultipleSelectInput = ({
//   label = "Skills",
//   placeholder = "Type and press Enter",
//   onChange,
// }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [skills, setSkills] = useState([]);

//   const handleKeyDown = (e) => {
//     if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
//       e.preventDefault();
//       const newSkill = inputValue.trim();
//       if (!skills.includes(newSkill)) {
//         const updatedSkills = [...skills, newSkill];
//         setSkills(updatedSkills);
//         setInputValue("");
//         if (onChange) onChange(updatedSkills);
//       }
//     }
//   };

//   const removeSkill = (index) => {
//     const updatedSkills = skills.filter((_, i) => i !== index);
//     setSkills(updatedSkills);
//     if (onChange) onChange(updatedSkills);
//   };
//   return (
//     <div>
//       <label className="block mb-2 text-sm font-medium">{label}</label>
//       <div className="flex flex-wrap items-center gap-2 border p-2 rounded">
//         {skills.map((skill, index) => (
//           <div
//             key={index}
//             className="flex items-center  text-blue-700 px-2 py-1 rounded-full text-sm"
//           >
//             {skill}
//             <button
//               type="button"
//               onClick={() => removeSkill(index)}
//               className="ml-1 text-red-500 hover:text-red-700"
//             >
//               &times;
//             </button>
//           </div>
//         ))}
//         <input
//           type="text"
//           className="flex-1 min-w-[100px] outline-none text-xs"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder={placeholder}
//         />
//       </div>
//     </div>
//   );
// };

// export default MultipleSelectInput;

// import { useState, useRef, useEffect } from "react";

// const MultipleSelectInput = ({
//   label = "Skills",
//   placeholder = "Select skills",
//   options = [],
//   onChange,
// }) => {
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const toggleOption = (key) => {
//     let updated = [];
//     if (selectedSkills.includes(key)) {
//       updated = selectedSkills.filter((item) => item !== key);
//     } else {
//       updated = [...selectedSkills, key];
//     }
//     setSelectedSkills(updated);
//     if (onChange) onChange(updated);
//   };

//   const handleClickOutside = (e) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const removeSkill = (key) => {
//     const updated = selectedSkills.filter((item) => item !== key);
//     setSelectedSkills(updated);
//     if (onChange) onChange(updated);
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <label className="block mb-2 text-sm font-medium">{label}</label>

//       {/* Tags display */}
//       <div
//         className="flex flex-wrap gap-2 border p-2 rounded cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {selectedSkills.length === 0 ? (
//           <span className="text-gray-400 text-sm">{placeholder}</span>
//         ) : (
//           selectedSkills.map((key) => {
//             const label = options.find((opt) => opt.key === key)?.label || key;
//             return (
//               <div
//                 key={key}
//                 className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
//               >
//                 {label}
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     removeSkill(key);
//                   }}
//                   className="ml-1 text-red-500 hover:text-red-700"
//                 >
//                   &times;
//                 </button>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-10 mt-1 w-full border rounded bg-white shadow p-2 max-h-40 overflow-y-auto">
//           {options.map((opt) => (
//             <label
//               key={opt.key}
//               className="flex items-center gap-2 text-sm p-1 hover:bg-gray-100 rounded cursor-pointer"
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedSkills.includes(opt.key)}
//                 onChange={() => toggleOption(opt.key)}
//               />
//               {opt.label}
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultipleSelectInput;

"use client";
const MultipleSelectInput = ({
  label,
  select,
  name,
  options,
  onChange,
  value,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#323232]">
        {label}
      </label>

      <select
        onChange={onChange}
        value={value}
        name={name}
        className="w-full text-sm font-normal p-2 text-darkBlack2 border border-[#EAEAEA] outline-none rounded-lg dark:bg-darkBlack2 dark:text-white bg-white"
      >
        <option className="text-lightGray" disabled selected>
          {select}
        </option>
        {options?.map((option) => (
          <option className="text-black" key={option?.key} value={option?.key}>
            {option?.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MultipleSelectInput;
