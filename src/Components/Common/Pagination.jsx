import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

/**
 * Reusable Pagination Component
 * Props:
 *  - page: current page number
 *  - onPrev: function to go to previous page
 *  - onNext: function to go to next page
 *  - hasNextPage: boolean — whether a next page exists (e.g. data.length >= limit)
 */
const Pagination = ({ page, onPrev, onNext, hasNextPage }) => {
  return (
    <div className="flex items-center justify-end gap-2 p-1.5   bg-white">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <IoIosArrowBack size={14} />
        Prev
      </button>

      <span className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md min-w-[60px] text-center">
        Page {page}
      </span>

      <button
        onClick={onNext}
        disabled={!hasNextPage}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <IoIosArrowForward size={14} />
      </button>
    </div>
  );
};

export default Pagination;
