
import { FaRegClock } from "react-icons/fa6";

const CategoryCard = ({ category, onEdit, onSelect }) => {
  return (
    <section >
      <div
        className="bg-[#eeeeee] rounded-xl p-6 cursor-pointer hover:shadow-md flex flex-col justify-between gap-2 h-[280px]"
        style={{ backgroundColor: category.bgColor }}
      >
        <img
          src={category.image}
          alt={category.title}
          className="h-[60px] mx-auto"
        />
        <h2 className="text-lg font-semibold text-center ">{category.title}</h2>
        <p className="text-sm text-center">{category.description}</p>
        <span className="flex items-center gap-1 justify-center ">
          <FaRegClock />
          <p className="text-sm text-center "> {category.time}</p>
        </span>
        <div className="flex justify-end pt-4">
         {/* <button
            onClick={() => onEdit(category.id)}
            className="text-sm text-blue-600 underline"
          >
            Edit
          </button>*/}
          
          <button
            onClick={() => onSelect(category)}
            className="bg-[#114654] text-white text-xs py-2 px-3 rounded-full  "
          >
            Show Details
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryCard;
