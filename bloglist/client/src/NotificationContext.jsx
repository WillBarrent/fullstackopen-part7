import { createContext, useState } from "react";

const NotificationContext = createContext();

export default NotificationContext;

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useState(null);

  const notificate = (message, time) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, time);
  };

  return (
    <NotificationContext.Provider value={{ notification, notificate }}>
      {props.children}
    </NotificationContext.Provider>
  );
};
