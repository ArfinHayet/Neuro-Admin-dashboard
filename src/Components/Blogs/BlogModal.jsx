
import { useState, useEffect } from "react";

const BlogModal = ({ isOpen, setIsOpen, onSave, blogToEdit }) => {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    if (blogToEdit) setBlog(blogToEdit);
    else setBlog({ title: "", content: "", image: "" });
  }, [blogToEdit]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(blog);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {blogToEdit ? "Edit Blog" : "Add New Blog"}
        </h2>
        <input
          type="text"
          name="title"
          value={blog.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          name="content"
          value={blog.content}
          onChange={handleChange}
          placeholder="Content"
          rows="4"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          name="image"
          value={blog.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => setIsOpen(false)}
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
  );
};

export default BlogModal;
