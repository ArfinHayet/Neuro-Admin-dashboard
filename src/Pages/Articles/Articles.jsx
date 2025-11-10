import { useState, useEffect } from "react";
import { createBlog, getAllBlogs } from "../../api/blogs";
import toast from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ✅ Quill CSS

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [blogToView, setBlogToView] = useState(null);

  const [blog, setBlog] = useState({
    heading: "",
    description: "",
  });

  // Fetch blogs
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs();
      const list = Array.isArray(res) ? res : res.payload || [];
      setBlogs(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    if (blogToEdit) setBlog(blogToEdit);
    else setBlog({ heading: "", description: "" });
  }, [blogToEdit]);

  const handleModalChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!blog.heading || !blog.description) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      if (blog.id) {
        setBlogs((prev) => prev.map((b) => (b.id === blog.id ? blog : b)));
        toast.success("Blog updated locally (API update coming soon)");
      } else {
        await createBlog(blog);
        toast.success("Blog created successfully");
        fetchBlogs();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save blog");
    }
  };

  const handleAdd = () => {
    setBlogToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (blog) => {
    setBlogToEdit(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    toast.success("Blog deleted locally (API delete coming soon)");
  };

  const handleView = (blog) => {
    setBlogToView(blog);
    setViewModalOpen(true);
  };

  const BlogDetails = ({ blog, onEdit, onDelete, onView }) => (
    <div className="relative p-3 border rounded-lg shadow-sm bg-white flex flex-col gap-1">
      <h3 className="text-sm font-semibold">{blog.heading}</h3>
      <p className="text-gray-700 text-xs">
        {blog.description?.slice(0, 120)}...
      </p>
      <div className="flex gap-2 right-2 absolute bottom-2">
        <button className="text-blue-600" onClick={() => onEdit(blog)}>
          <AiFillEdit />
        </button>
        <button className="text-teal-800" onClick={() => onView(blog)}>
          <IoEye />
        </button>
        <button
          className="text-red-600 text-sm font-medium"
          onClick={() => onDelete(blog.id)}
        >
          Delete
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
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 ">
          <div className="bg-white p-5 rounded-lg w-[30vw] shadow-lg h-[55vh]">
            <h2 className="text-lg font-bold mb-2">
              {blogToEdit ? "Edit Article" : "Add New Article"}
            </h2>
            <label className="text-xs pb-1">Heading</label>
            <input
              type="text"
              name="heading"
              value={blog.heading}
              onChange={handleModalChange}
              placeholder="Heading"
              className="w-full p-2 border rounded mb-2 text-sm"
            />
            <label htmlFor="" className="text-xs pb-1">Description</label>
            <ReactQuill
              theme="snow"
              value={blog.description}
              onChange={(value) => setBlog({ ...blog, description: value })}
              className="pb-2 h-[160px]"
            />
            <div className="flex justify-between text-sm mt-[12%]">
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
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{blogToView.heading}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: blogToView.description }}
              className="text-gray-700"
            />
            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
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
