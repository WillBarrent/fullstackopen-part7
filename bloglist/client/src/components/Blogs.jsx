import { Link } from "react-router-dom";
import Blog from "./Blog";
import Notification from "./Notification";
import { useBlogs } from "../store";

const Blogs = () => {
  const blogs = useBlogs();

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
