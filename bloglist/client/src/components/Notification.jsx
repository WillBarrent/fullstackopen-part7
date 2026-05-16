import { Alert } from "@mui/material";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const Notification = () => {
  const { notification } = useContext(NotificationContext);

  if (notification === null) {
    return null;
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity="info">
      {notification}
    </Alert>
  );
};

export default Notification;
