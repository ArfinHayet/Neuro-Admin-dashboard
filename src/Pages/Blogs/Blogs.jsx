
import { useState } from "react";
import BlogList  from "../../Components/Blogs/BlogList";
import BlogModal from "../../Components/Blogs/BlogModal";
import { dummyblogs } from "../../Components/utils/Data";

const Blogs = () => {
  const [blogs, setBlogs] = useState(dummyblogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);

  const handleAdd = () => {
    setBlogToEdit(null);
    setIsModalOpen(true);
  };

  const handleSave = (blog) => {
    if (blog.id) {
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? blog : b)));
    } else {
      setBlogs((prev) => [...prev, { ...blog, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (blog) => {
    setBlogToEdit(blog);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-medium mb-4">Blog List</h2>
        <button
          className="px-4 py-2 bg-[#114654] text-white rounded-full"
          onClick={handleAdd}
        >
          Add New Blog
        </button>
      </div>

      <BlogList blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />

      <BlogModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSave={handleSave}
        blogToEdit={blogToEdit}
      />
    </section>
  );
};

export default Blogs;
