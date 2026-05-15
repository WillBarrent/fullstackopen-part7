import { Alert } from "@mui/material";
import { useNotification } from "../store";

const Notification = () => {
  const notification = useNotification();

  if (notification.length === 0) {
    return null;
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity="info">
      {notification}
    </Alert>
  );
};

export default Notification;
