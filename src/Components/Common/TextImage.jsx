

const TextImage = ({ label,src }) => {
  return (
    <p className="flex flex-col gap-1">
      <span className="text-[#959595] text-sm font-medium">{label}</span>
      <img
        className="h-[40px] w-[40px] object-contain"
        src={src}
      />
    </p>
  );
};

export default TextImage;
