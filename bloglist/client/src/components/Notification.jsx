import { Alert } from "@mui/material";

const Notification = ({ notification }) => {
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
