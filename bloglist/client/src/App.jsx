import { useEffect, useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch,
} from "react-router-dom";
import Blog from "./components/Blog";
import blogService, { getUsers } from "./services/blogs";
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
import { getUser, removeUser } from "./services/persistenUser";
import Users from "./components/Users";
import UserInfo from "./components/UserInfo";

const App = () => {
  const { blogs, isPending, create } = useBlogs();
  const { notification } = useContext(NotificationContext);
  const { setUser, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const match = useMatch("/blogs/:id");
  const userMatch = useMatch("/users/:id");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  useEffect(() => {
    const loggedUser = getUser();
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
  const singleUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  const handleLogout = (event) => {
    event.preventDefault();

    removeUser();
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
              <Button color="inherit" component={Link} to="/users">
                <Typography>users</Typography>
              </Button>
            )}
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
          <Route path="/users" element={<Users users={users} />} />
          <Route path="/blogs/:id" element={<Blog blog={blog} />} />
          <Route path="/users/:id" element={<UserInfo user={singleUser} />} />
          <Route
            path="/create"
            element={<NewBlogForm handleBlogAddition={handleBlogAddition} />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
