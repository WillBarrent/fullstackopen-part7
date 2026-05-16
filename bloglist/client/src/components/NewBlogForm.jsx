import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { Button, TextField } from "@mui/material";
import NotificationContext from "../NotificationContext";
import UserContext from "../UserContext";
import { useField } from "../hooks";

const NewBlogForm = ({ handleBlogAddition }) => {
  const title = useField("title", "text");
  const author = useField("author", "text");
  const url = useField("link", "text");
  const { notification } = useContext(NotificationContext);
  const { isLoggedIn } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      return navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const addBlog = (event) => {
    event.preventDefault();

    handleBlogAddition({ title, author, url });
  };

  return (
    <form onSubmit={addBlog}>
      <h2>Create new blog</h2>
      <Notification notification={notification} />
      <div>
        <TextField {...title} style={{ marginBottom: 10 }} />
      </div>
      <div>
        <TextField {...author} style={{ marginBottom: 10 }} />
      </div>
      <div>
        <TextField {...url} style={{ marginBottom: 10 }} />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        create
      </Button>
    </form>
  );
};

export default NewBlogForm;
