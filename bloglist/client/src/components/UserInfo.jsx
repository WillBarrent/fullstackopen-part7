import { Box, Typography } from "@mui/material";

const UserInfo = ({ user }) => {
  return (
    <Box style={{ marginTop: 10 }}>
      <Typography variant="h4">{user.username}</Typography>
      <Typography style={{ marginTop: 10 }} variant="h5">
        added blogs
      </Typography>
      <ul>{user.blogs.map((blog) => {
        return <li>{blog.title}</li>
      })}</ul>
    </Box>
  );
};

export default UserInfo;
