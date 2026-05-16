import { Button, TextField } from "@mui/material";
import Notification from "./Notification";
import { useContext, useEffect } from "react";
import NotificationContext from "../NotificationContext";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { saveUser } from "../services/persistenUser";
import { useField } from "../hooks";

const Login = () => {
  const { notification, notificate } = useContext(NotificationContext);
  const { isLoggedIn, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const username = useField("username", "text");
  const password = useField("password", "password");

  useEffect(() => {
    if (isLoggedIn()) {
      return navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value,
      });
      saveUser(user);
      blogService.setToken(user.token);

      setUser(user);

      notificate("You have successfully logged in!", 3000);
      navigate("/");
    } catch (error) {
      notificate(error.response.data.error, 3000);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification notification={notification} />
      <div>
        <TextField {...username} style={{ marginBottom: 10 }} />
      </div>
      <div>
        <TextField {...password} />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        login
      </Button>
    </form>
  );
};

export default Login;
