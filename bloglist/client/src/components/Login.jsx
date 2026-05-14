import { Button, TextField } from "@mui/material";
import Notification from "./Notification";

const Login = ({
  handleLogin,
  notification,
  username,
  setUsername,
  password,
  setPassword,
}) => {
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
