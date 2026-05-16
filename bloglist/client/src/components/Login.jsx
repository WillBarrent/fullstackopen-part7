import { Button, TextField } from "@mui/material";
import Notification from "./Notification";
import { useContext, useEffect } from "react";
import NotificationContext from "../NotificationContext";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";

const Login = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  const { notification } = useContext(NotificationContext);
  const { isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      return navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification notification={notification} />
      <div>
        <TextField
          label="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          style={{ marginBottom: 10 }}
        />
      </div>
      <div>
        <TextField
          label="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        login
      </Button>
    </form>
  );
};

export default Login;
