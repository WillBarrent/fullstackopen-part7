import { useState, useEffect, useContext } from "react";
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
import NotificationContext from "./NotificationContext";
import { useBlogs } from "./hooks";
import UserContext from "./UserContext";

const App = () => {
  const { blogs, isPending, create } = useBlogs();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { notification, notificate } = useContext(NotificationContext);
  const { setUser, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const match = useMatch("/blogs/:id");

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [setUser]);

  if (isPending) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes);
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");

      notificate("You have successfully logged in!", 3000);
      navigate("/");
    } catch (error) {
      notificate(error.response.data.error, 3000);
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

    create(newBlog);

    navigate("/");
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
          <Route
            path="/"
            element={
              <Blogs notification={notification} sortedBlogs={sortedBlogs} />
            }
          />
          <Route path="/blogs/:id" element={<Blog blog={blog} />} />
          <Route
            path="/create"
            element={<NewBlogForm handleBlogAddition={handleBlogAddition} />}
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
