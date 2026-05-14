import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { Button, TextField } from "@mui/material";

const NewBlogForm = ({ handleBlogAddition, notification, user }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const navigate = useNavigate();

  if (!user) {
    return navigate("/");
  }

  const addBlog = (event) => {
    event.preventDefault();

    handleBlogAddition({ title, author, url });
  };

  return (
    <form onSubmit={addBlog}>
      <h2>Create new blog</h2>
      <Notification notification={notification} />
      <div>
        <TextField
          label="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          style={{ marginBottom: 10 }}
        />
      </div>
      <div>
        <TextField
          label="author"
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
          }}
          style={{ marginBottom: 10 }}
        />
      </div>
      <div>
        <TextField
          label="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          style={{ marginBottom: 10 }}
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        create
      </Button>
    </form>
  );
};

export default NewBlogForm;
