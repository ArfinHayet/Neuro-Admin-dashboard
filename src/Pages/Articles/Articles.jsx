import { useState, useEffect } from "react";
import {
  createBlog,
  getAllBlogs,
  deleteBlogs,
  updateBlog,
} from "../../api/blogs";
import toast from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { RiDeleteBin2Fill } from "react-icons/ri";


const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [blogToView, setBlogToView] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const [blog, setBlog] = useState({
    heading: "",
    description: "",
    image: "",
  });

 


  // Fetch blogs
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs();
      const list = Array.isArray(res) ? res : res.payload || [];
      console.log(list)
      setBlogs(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    if (blogToEdit) {
      console.log("Editing blog:", blogToEdit);
      setBlog({
        heading: blogToEdit.heading || "",
        description: blogToEdit.description || "",
        image: blogToEdit.image || "",
        id: blogToEdit.id || blogToEdit._id || null,
      });
    

    } else {
      setBlog({ heading: "", description: "", image: "" });
    }
  }, [blogToEdit]);


  const handleModalChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // validation
    if (!blog.heading || !blog.description || !blog.image) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // build JSON payload (backend only accepts JSON)
      const payload = {
        heading: blog.heading,
        description: blog.description,
        image: blog.image, // this must be a string (filename)
      };

      console.log(payload)

      let response;
      if (blog.id || blog._id) {
        // update existing blog
        response = await updateBlog(blog.id || blog._id, payload);
      } else {
        // create new blog
        response = await createBlog(payload);
      }

      // handle response
      if (
        response.statusCode === 200 ||
        response.message?.includes("success")
      ) {
        toast.success(
          blog.id ? "Blog updated successfully" : "Blog created successfully"
        );
        setIsModalOpen(false);
        setBlog({ heading: "", description: "", image: "" });
        fetchBlogs();
      } else {
        toast.error(response.message || "Failed to save blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save blog");
    }
  };


  const handleAdd = () => {
    setBlogToEdit(null);
    setBlog({ heading: "", description: "", image: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (blog) => {

    setBlogToEdit(blog);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (blog) => {
    setDeleteId(blog.id || blog._id);
    setDeleteTitle(blog.heading);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteBlogs(deleteId);

      if (res.statusCode === 200 || res.message?.includes("deleted")) {
        setBlogs((prev) =>
          prev.filter(
            (b) =>
              b._id?.toString() !== deleteId?.toString() && b.id !== deleteId
          )
        );
        toast.success("Blog deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting blog");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleView = (blog) => {
    setBlogToView(blog);
    setViewModalOpen(true);
  };

  const BlogDetails = ({ blog, onEdit, onDelete, onView }) => (
    <div className="relative p-3 h-[150px] border rounded-lg shadow-sm bg-white flex flex-col gap-1">
      <h3 className="text-sm font-semibold">{blog.heading}</h3>

      {/* <p className="text-gray-700 text-xs">
        {blog.description?.slice(0, 100)}...
      </p> */}
      <div className="flex gap-2 right-2 absolute bottom-2">
        <button className="text-blue-600" onClick={() => onEdit(blog)}>
          <AiFillEdit />
        </button>
        <button className="text-teal-800" onClick={() => onView(blog)}>
          <IoEye />
        </button>
        <button
          className="text-red-600 text-sm font-medium"
          onClick={() => onDelete(blog)}
        >
          <RiDeleteBin2Fill />
        </button>
      </div>
    </div>
  );

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Article List</h2>
        <button
          className="px-4 py-2 bg-[#114654] text-white rounded-full text-sm"
          onClick={handleAdd}
        >
          Add New Article
        </button>
      </div>
      <p className="text-secondary text-sm mb-4">
        View and update all articles to be updated and relevant.
      </p>

      <div className="grid lg:grid-cols-4 gap-4 h-[120px]">
        {blogs.map((blog) => (
          <BlogDetails
            key={blog.id || blog._id}
            blog={blog}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onView={handleView}
          />
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 pt-10 flex items-start justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-sm mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                "{deleteTitle}"
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-[#114654] text-white px-4 py-1 rounded hover:bg-opacity-80 text-sm"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 ">
          <div className="bg-white p-5 rounded-lg w-[55vw] shadow-lg h-[85vh] text-sm">
            <h2 className="text-lg font-bold mb-2">
              {blogToEdit ? "Edit Article" : "Add New Article"}
            </h2>
            <label className="text-xs pb-1">Heading</label>
            <input
              type="text"
              name="heading"
              value={blog?.heading}
              onChange={(e) => setBlog({ ...blog, heading: e.target.value })}
              // onChange={handleModalChange}
              placeholder="Heading"
              className="w-full p-2 border rounded mb-2 text-sm"
            />
            <label htmlFor="" className="text-xs pb-1">
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={blog.description}
              onChange={(value) => setBlog({ ...blog, description: value })}
              className="mb-[6%] h-[43vh]"
            />

            <label className="text-xs pb-1 ">Image</label>

            <input
              type="file"
              // accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setBlog({ ...blog, image: file.name }); 
                }
              }}
            />

            {/* {blog.image && (
              <img
                src={blog.image}
                alt="preview"
                className="w-16 h-16 object-cover mt-2 border rounded"
              />
            )} */}

            <div className="flex justify-between text-sm mt-[2%]">
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

      {/* View Modal */}
      {viewModalOpen && blogToView && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[60vw] shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{blogToView.heading}</h2>
            <img
              src={blogToView.image}
              alt="Blog"
              className="object-cover rounded h-32 w-[90%] mx-auto border"
            />
         
            <div
              dangerouslySetInnerHTML={{ __html: blogToView.description }}
              className="text-gray-700 text-sm"
            />
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

export default Blogs;
