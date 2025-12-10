import { useState, useEffect } from "react";
import {
  createBanners,
  getAllBanners,
  deleteBanners,
} from "../../api/bannerimg";
import { uploadFile } from "../../api/uploadfiles";
import toast from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import { domain } from "../../../credential";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";



const BannerImg = () => {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [bannerToView, setBannerToView] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const [banner, setBanner] = useState({
    name: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      const res = await getAllBanners();
      const list = Array.isArray(res) ? res : res.payload || [];
      console.log(list)
        setBanners(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch banners");
    }
  };

  const handleAdd = () => {
    setBanner({ name: "", description: "", image: "" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!banner.name || !banner.description || !banner.image) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      let filename = banner.image;

      if (banner.image instanceof File) {
        const res = await uploadFile(banner.image);
        filename = res?.payload?.filename;
      }

      const payload = {
        imagePath: `temp-uploads/${filename}`,
        name: banner.name,
        description: banner.description,
      };

      const response = await createBanners(payload);

      if (
        response.statusCode === 200 ||
        response.message?.includes("success")
      ) {
        toast.success("Banner created successfully");
        setIsModalOpen(false);
        setBanner({ name: "", description: "", image: "" });
        fetchBannerData();
      } else {
        toast.error(response.message || "Failed to save banner");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving banner");
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteId(item.id || item._id);
    setDeleteName(item.name);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteBanners(deleteId);
      if (res.statusCode === 200 || res.message?.includes("deleted")) {
        setBanners((prev) =>
          prev.filter((b) => b.id !== deleteId && b._id !== deleteId)
        );
        toast.success("Banner deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete banner");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting banner");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleView = (item) => {
    setBannerToView(item);
    setViewModalOpen(true);
  };

  const BannerCard = ({ item }) => (
    <div className="relative  overflow-hidden h-[240px] border rounded-lg shadow-sm bg-white flex flex-col justify-between">
      <h3 className="text-sm font-semibold  p-3">{item.name}</h3>
      <img
        src={`${domain.replace(/\/$/, "")}/${item.imagePath}`}
        className="w-full h-[170px] object-cover"
      />

      <div className=" flex gap-2 right-2 absolute bottom-2 text-[17px]">
        <div className="rounded-full w-9 h-9 bg-gray-100/90 hover:bg-white flex justify-center ">
         <button className="text-blue-600" onClick={() => handleView(item)}>
          <IoEye />
          </button>
        </div>
        <div className="rounded-full w-9 h-9 bg-gray-100/90 hover:bg-white flex justify-center ">
        <button
          className="text-red-600"
          onClick={() => handleDeleteClick(item)}
        >
          <RiDeleteBin2Fill />
          </button>
          </div>
      </div>
    </div>
  );

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Banner List</h2>
        <button
          className="px-4 py-2 bg-[#114654] text-white rounded-full text-sm"
          onClick={handleAdd}
        >
          Add New Banner
        </button>
      </div>
      <p className="text-secondary text-sm mb-4">Manage all banners here.</p>

      <div className="grid lg:grid-cols-4 gap-4 h-[120px]">
        {banners.map((item) => (
          <BannerCard key={item.id || item._id} item={item} />
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 pt-10 flex items-start justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-sm mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">"{deleteName}"</span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-[#114654] text-white px-4 py-1 rounded text-sm"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-1 rounded text-sm"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[55vw] shadow-lg h-[55vh] text-sm">
            <h2 className="text-lg font-bold mb-2">Add New Banner</h2>

            <label className="text-xs pb-1">Name</label>
            <input
              type="text"
              value={banner.name}
              onChange={(e) => setBanner({ ...banner, name: e.target.value })}
              className="w-full p-2 border rounded mb-2 text-sm"
            />

          <label htmlFor="" className="text-xs pb-1">
                       Description
                     </label>
                     <ReactQuill
                       theme="snow"
                       value={banner.description}
                       onChange={(value) => setBanner({ ...banner, description: value })}
                       className="mb-[7%] h-[14vh]"
                     />

            <label className="text-sm pb-1 pr-2">Image</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setBanner({ ...banner, image: file });
              }}
            />

            <div className="flex justify-between text-sm mt-4">
              <button
                className="px-4 py-1.5 bg-gray-200 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 bg-[#114654] text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {viewModalOpen && bannerToView && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[60vw] shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{bannerToView.name}</h2>

            <img
              src={`${domain.replace(/\/$/, "")}/${bannerToView.imagePath}`}
              alt={bannerToView.name}
              className="object-cover rounded h-32 w-[90%] mx-auto border"
            />

            <p className="text-gray-700 text-sm mt-2">
              {bannerToView.description}
            </p>

            <button
              className="mt-4 px-4 py-1 bg-gray-200 rounded text-sm"
              onClick={() => setViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BannerImg;
