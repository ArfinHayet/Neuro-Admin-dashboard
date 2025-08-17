const TextInput = ({
  label,
  name,
  placeholder,
  value,
  type,
  className,
  onChange,
  classw,
  defaultValue,
}) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-[#FFFFFF] text-[#565656] outline-none border border-[#E8E8E8] text-xs px-3 py-3 rounded-md ${classw}`}
      />
    </div>
  );
};

export default TextInput;
