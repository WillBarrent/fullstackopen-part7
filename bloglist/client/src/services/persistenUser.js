export const getUser = () => {
  const userJson = window.localStorage.getItem("loggedUser");
  return userJson;
};

export const saveUser = (user) => {
  window.localStorage.setItem("loggedUser", JSON.stringify(user));
};

export const removeUser = () => {
  window.localStorage.removeItem("loggedUser");
};
