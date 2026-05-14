import { useNavigate } from "react-router-dom";
import blogService from "../services/blogs";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

const Blog = ({ blog, blogs, setBlogs, user, handleLike }) => {
  const navigate = useNavigate();

  const handleDeletion = async (event) => {
    event.preventDefault();

    try {
      await blogService.remove(blog.id);
      const newBlogs = blogs.filter((b) => b.id !== blog.id);
      setBlogs(newBlogs);
      navigate("/");
    } catch (error) {
      console.log(error.reponse);
    }
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
            <Button onClick={() => {
              handleLike(blog);
            }} variant="outlined">
              like
            </Button>
          )}

          {!user || blog.user.username !== user.username ? (
            <></>
          ) : (
            <Button onClick={handleDeletion} variant="outlined" color="error">
              remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Blog;
