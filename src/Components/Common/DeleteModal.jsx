import Modal from "./Modal";

const ConfirmDeleteModal = ({
  isOpen,
  closeModal,
  onConfirm,
  title = "Are You Sure?",
  description = "Do you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmBtnClass = "bg-gradient-to-r from-[#088395] to-[#0A6876] text-sm  text-white",
  cancelBtnClass = "border border-[#0A6876] text-[#0A6876] bg-",
}) => {
  return (
    <Modal
      classname="w-[18vw] overflow-hidden"
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div className="-mt-9">
        <h2 className="text-sm mb-3 font-bold text-[#3B3B3B]">{title}</h2>
        <p className="text-xs font-normal text-[#6C6C6C]">{description}</p>
        <div className="flex justify-start my-4 gap-2">
          <button
            className={`btn min-h-0 w-[64px] rounded-lg h-[32px] text-xs ${cancelBtnClass}`}
            onClick={closeModal}
          >
            {cancelText}
          </button>
          <button
            className={`btn min-h-0 w-[84px] rounded-lg h-[32px] text-sm ${confirmBtnClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
