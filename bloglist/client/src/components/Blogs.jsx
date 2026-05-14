import { Link } from "react-router-dom";
import Blog from "./Blog";
import Notification from "./Notification";

const Blogs = ({ notification, sortedBlogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification}/>
      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
