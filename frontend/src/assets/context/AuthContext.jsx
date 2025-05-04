import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const userAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("authUser")) || null
  );

  const [privateKey, setPrivateKey] = useState(
    localStorage.getItem("privateKey")
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, privateKey }}>
      {children}
    </AuthContext.Provider>
  );
};
