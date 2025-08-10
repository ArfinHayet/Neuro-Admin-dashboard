const SelectInput = ({
  label,
  select,
  name,
  options,
  onChange,
  value,
  className,
  classw,
  // defaultValue,
}) => {
  return (
    <div className={`flex flex-col gap-3 ${classw} `}>
      <label className="text-sm font-medium text-[#323232]">{label}</label>

      <select
        name={name}
        onChange={onChange}
        value={value}
        className={`bg-[#FFFFFF] mt-1 text-[#959595] outline-none border border-[#E8E8E8] text-xs px-2 py-[8px] ${className} rounded-md`}
      >
        <option value="" >
          {select}
        </option>
        {options?.map((option) => (
          <option className="text-black" key={option?.key} value={option?.key}>
            {option?.label}
          </option>
        ))}
      </select>

      {/* <select
        onChange={onChange}
        value={value}
        // defaultValue={defaultValue}
        name={name}
        className={`bg-[#FFFFFF] mt-1 text-[#959595] outline-none border border-[#E8E8E8] text-xs  px-2 py-[8px] ${className} rounded-md`}
      >
        <option
          className="text-xs text-[#959595]"
          disabled
          defaultValue
          selected
        >
          {select}
        </option>
        {options?.map((option) => (
          <option className="text-black" key={option?.key} value={option?.key}>
            {option?.label}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default SelectInput;
