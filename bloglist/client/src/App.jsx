import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch,
} from "react-router-dom";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import NewBlogForm from "./components/NewBlogForm";
import Blogs from "./components/Blogs";
import Login from "./components/Login";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");

      setNotification("You have successfully logged in!");
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      navigate("/");
    } catch (error) {
      setNotification(error.response.data.error);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem("loggedUser");
    setUser(null);

    navigate("/");
  };

  const handleBlogAddition = async ({ title, author, url }) => {
    const newBlog = {
      title,
      author,
      url,
    };

    try {
      const blog = await blogService.create(newBlog);
      setBlogs([...blogs, { ...blog, user: user }]);

      setNotification("Blog has been added!");
      setTimeout(() => {
        setNotification(null);
      }, 5000);

      navigate("/");
    } catch (error) {
      setNotification(error.response.data.error);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLike = async (blog) => {
    try {
      const result = await blogService.update(blog.id, {
        ...blog,
        user: blog.user.id,
        likes: ++blog.likes,
      });

      const newBlogs = blogs.map((blog) => {
        if (blog.id === result.id) {
          return {
            ...result,
            user: blog.user,
          };
        }

        return blog;
      });

      setBlogs(newBlogs);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h5">Blog App</Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">
              <Typography>blogs</Typography>
            </Button>
            {!user ? (
              <></>
            ) : (
              <Button color="inherit" component={Link} to="/create">
                <Typography>new blog</Typography>
              </Button>
            )}
            {!user ? (
              <Button color="inherit" component={Link} to="/login">
                <Typography>login</Typography>
              </Button>
            ) : (
              <Button color="inherit" onClick={handleLogout}>
                <Typography>logout</Typography>
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route
          path="/"
          element={
            <Blogs notification={notification} sortedBlogs={sortedBlogs} />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              blogs={blogs}
              setBlogs={setBlogs}
              user={user ? user : null}
              handleLike={handleLike}
            />
          }
        />
        <Route
          path="/create"
          element={
            <NewBlogForm
              handleBlogAddition={handleBlogAddition}
              notification={notification}
              user={user}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              handleLogin={handleLogin}
              notification={notification}
              password={password}
              setPassword={setPassword}
              user={user}
              setUsername={setUsername}
            />
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
