import { Button, TextField } from "@mui/material";
import Notification from "./Notification";
import { useLoggedUserActions } from "../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  const { isLoggedIn } = useLoggedUserActions();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      return navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification />
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
