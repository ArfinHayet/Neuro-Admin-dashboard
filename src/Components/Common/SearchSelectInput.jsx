import React, { useState, useEffect, useRef } from "react";

const SearchSelectInput = ({ label, options, onChange, classw }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options?.filter((option) =>
    option?.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`flex flex-col gap-3 ${classw}`}>
      <label className="text-sm font-medium text-[#323232]">{label}</label>

      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          className="bg-[#FFFFFF] mt-1 text-[#959595] outline-none border border-[#E8E8E8] text-xs px-2 py-[8px] rounded-md w-full"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />

        {isOpen && (
          <div
            className="absolute w-full mt-1 bg-white border border-[#E8E8E8] rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
            style={{ maxHeight: "120px", zIndex: 100 }}
          >
            {filteredOptions?.length > 0 ? (
              filteredOptions?.map((option) => (
                <div
                  key={option?.key}
                  className="text-xs text-black px-2 py-[8px] cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    onChange(option); 
                    setSearchTerm(option.label); 
                    setIsOpen(false);
                  }}
                >
                  {option?.label}
                </div>
              ))
            ) : (
              <div className="text-xs text-[#959595] px-2 py-[8px]">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSelectInput;
