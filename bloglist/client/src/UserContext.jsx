import { createContext, useState } from "react";

const UserContext = createContext();

export default UserContext;

export const UserContextProvider = (props) => {
  const [user, setUser] = useState({});

  const isLoggedIn = () => (Object.entries(user).length === 0 ? false : true);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn }}>
      {props.children}
    </UserContext.Provider>
  );
};
