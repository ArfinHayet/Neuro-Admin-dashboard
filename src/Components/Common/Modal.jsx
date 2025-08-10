// import React, { useRef } from "react";
// import { RxCross2 } from "react-icons/rx";

// const Modal = ({ isOpen, closeModal, children }) => {
//   const modalRef = useRef(null);

//   //   useEffect(() => {
//   //     const handleClickOutside = (event) => {
//   //       if (modalRef.current && !modalRef.current.contains(event.target)) {
//   //         closeModal();
//   //       }
//   //     };

//   //     if (isOpen) {
//   //       document.addEventListener("mousedown", handleClickOutside);
//   //     } else {
//   //       document.removeEventListener("mousedown", handleClickOutside);
//   //     }

//   //     return () => {
//   //       document.removeEventListener("mousedown", handleClickOutside);
//   //     };
//   //   }, [isOpen, closeModal]);

//   return (
//     isOpen && (
//       <>
//         <div
//           className="bg-white bg-opacity-40 fixed inset-0"
//           onClick={closeModal}
//         ></div>
//         <div
//           ref={modalRef}
//           className="fixed inset-0 min-h-screen flex justify-center items-center bg-[#BBBBBB4D] bg-opacity-50 "
//         >
//           <div className="bg-[#FFFFFF] border border-white flex flex-col gap-5 w-[361px] md:w-[486px] p-6 rounded-lg shadow-lg">
//             <div className="flex justify-end items-end gap-4">
//               <button onClick={closeModal}>
//                 <RxCross2 className="text-xl" />
//               </button>
//             </div>
//             {children}
//           </div>
//         </div>
//       </>
//     )
//   );
// };

// export default Modal;

import React, { useRef } from "react";
import { RxCross2 } from "react-icons/rx";

const Modal = ({ isOpen, closeModal, children, classname, title }) => {
  const modalRef = useRef(null);

  return (
    isOpen && (
      <div
        className="fixed z-20 inset-0 min-h-screen flex justify-center items-center bg-[#BBBBBB4D] bg-opacity-50"
        onClick={closeModal}
      >
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#FFFFFF] flex flex-col gap-5 p-6 rounded-lg shadow-lg ${classname}`}
        >
          <div className="flex flex-row justify-between mb-4">
            <p className="text-xl font-medium text-[#333333]">{title}</p>
            <button onClick={closeModal}>
              <RxCross2 className="text-xl" />
            </button>
          </div>

          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
