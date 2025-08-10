import React from "react";

const BlogDetails = ({ blog, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex flex-col gap-2">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-bold">{blog.title}</h3>
      <p className="text-gray-700 text-sm">
        {blog.content.slice(0, 50)}...
      </p>
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

export default BlogDetails;
