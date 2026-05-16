import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useBlogs, useField } from "../hooks";
import { useContext } from "react";
import UserContext from "../UserContext";

const Blog = ({ blog }) => {
  const navigate = useNavigate();
  const { remove, likeBlog, addComment } = useBlogs();
  const { user, isLoggedIn } = useContext(UserContext);
  const comment = useField("add a comment", "text");

  const handleDeletion = async (event) => {
    event.preventDefault();

    remove(blog.id);
    navigate("/");
  };

  const handleCommentAddition = (event) => {
    event.preventDefault();
    addComment(blog.id, comment.value);
  };

  if (!blog) {
    return <></>;
  }

  return (
    <Card style={{ marginTop: 10 }} className="blog">
      <CardContent>
        <Typography variant="h5" className="title">
          {blog.title}
        </Typography>
        <Typography variant="caption" className="author">
          by {blog.author}
        </Typography>
        <Typography className="url" variant="body1">
          <a href={`https://${blog.url}`}>{blog.url}</a>
        </Typography>
        <Typography variant="body1" className="addedBy">
          Added by {blog.user.username}
        </Typography>
        <Stack
          sx={{ alignItems: "center" }}
          direction="row"
          spacing={2}
          style={{ marginTop: 10 }}
        >
          <Typography noWrap>
            <span
              style={{ marginRight: 5 }}
              className="likes"
              data-testid="likes"
            >
              {blog.likes}
            </span>
            likes
          </Typography>
          {!user ? null : (
            <Button
              onClick={() => {
                likeBlog(blog.id, blog);
              }}
              variant="outlined"
            >
              like
            </Button>
          )}

          {!isLoggedIn() || blog.user.username !== user.username ? (
            <></>
          ) : (
            <Button onClick={handleDeletion} variant="outlined" color="error">
              remove
            </Button>
          )}
        </Stack>
        <Typography variant="h5" style={{ marginTop: 20 }}>
          Comments
        </Typography>
        {isLoggedIn() ? (
          <form onSubmit={handleCommentAddition} style={{ marginTop: 10 }}>
            <Stack direction={"row"}>
              <TextField {...comment} />
              <Button
                type="submit"
                variant="contained"
                style={{ marginLeft: 10 }}
              >
                add comment
              </Button>
            </Stack>
          </form>
        ) : null}
        <ul>
          {blog.comments.map((comment) => {
            return <li key={comment.id}>{comment.comment}</li>;
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Blog;
