
import BlogDetails from "./BlogDetails";

const BlogList = ({ blogs, onEdit, onDelete }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {blogs.map((blog) => (
        <BlogDetails
          key={blog.id}
          blog={blog}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BlogList;
