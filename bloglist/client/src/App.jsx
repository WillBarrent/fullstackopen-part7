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
import { ErrorBoundary } from "react-error-boundary";
import NotFound from "./components/NotFound";
import {
  useBlogActions,
  useBlogs,
  useLoggedUser,
  useLoggedUserActions,
  useNotificationActions,
} from "./store";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogs = useBlogs();
  const user = useLoggedUser();
  const navigate = useNavigate();
  const { initialize, create, like } = useBlogActions();
  const { setNotification } = useNotificationActions();
  const { setUser, isLoggedIn } = useLoggedUserActions();

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [setUser]);

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
    setUser({});

    navigate("/");
  };

  const handleBlogAddition = async ({ title, author, url }) => {
    const newBlog = {
      title,
      author,
      url,
    };

    try {
      await create(newBlog, user);

      setNotification("Blog has been added!");
      setTimeout(() => {
        setNotification("");
      }, 5000);

      navigate("/");
    } catch (error) {
      setNotification(error.response.data.error);
      setTimeout(() => {
        setNotification("");
      }, 5000);
    }
  };

  const handleLike = async (blog) => {
    try {
      await like(blog);
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
            {!isLoggedIn() ? (
              <></>
            ) : (
              <Button color="inherit" component={Link} to="/create">
                <Typography>new blog</Typography>
              </Button>
            )}
            {!isLoggedIn() ? (
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
      <ErrorBoundary
        fallback={
          <Box style={{ marginTop: 10 }}>
            <Typography variant="h5">Something went wrong</Typography>
          </Box>
        }
      >
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Blogs />} />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                blogs={blogs}
                handleLike={handleLike}
              />
            }
          />
          <Route
            path="/create"
            element={
              <NewBlogForm
                handleBlogAddition={handleBlogAddition}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                handleLogin={handleLogin}
                password={password}
                setPassword={setPassword}
                setUsername={setUsername}
              />
            }
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
