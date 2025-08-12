import { useState, useEffect } from "react";
import { dummyblogs } from "../../Components/utils/Data";

const Blogs = () => {
  const [blogs, setBlogs] = useState(dummyblogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    if (blogToEdit) setBlog(blogToEdit);
    else setBlog({ title: "", content: "", image: "" });
  }, [blogToEdit]);

  const handleModalChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (blog.id) {
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? blog : b)));
    } else {
      setBlogs((prev) => [...prev, { ...blog, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setBlogToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (blog) => {
    setBlogToEdit(blog);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  const BlogDetails = ({ blog, onEdit, onDelete }) => {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col gap-2">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-40 object-cover rounded"
        />
        <h3 className="text-lg font-bold">{blog.title}</h3>
        <p className="text-gray-700 text-sm">{blog.content.slice(0, 50)}...</p>
        <div className="flex gap-2 mt-2">
          <button
            className="text-blue-600 text-sm font-medium"
            onClick={() => onEdit(blog)}
          >
            Edit
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
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl px-6 pt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium mb-4">Blog List</h2>
        <button
          className="px-4 py-2 bg-[#114654] text-white rounded-full text-sm"
          onClick={handleAdd}
        >
          Add New Blog
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <BlogDetails
            key={blog.id}
            blog={blog}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {blogToEdit ? "Edit Blog" : "Add New Blog"}
            </h2>
            <input
              type="text"
              name="title"
              value={blog.title}
              onChange={handleModalChange}
              placeholder="Title"
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              name="content"
              value={blog.content}
              onChange={handleModalChange}
              placeholder="Content"
              rows="4"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              name="image"
              value={blog.image}
              onChange={handleModalChange}
              placeholder="Image URL"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#114654] text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blogs;
