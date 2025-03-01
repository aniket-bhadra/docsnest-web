import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
  user: null,
  setUser: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  });

  //    to update localStorage when user changes.
  // useEffect(() => {
  //   localStorage.setItem("userInfo", JSON.stringify(user));
  // }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
