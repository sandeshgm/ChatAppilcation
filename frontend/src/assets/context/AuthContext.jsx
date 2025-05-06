// import { createContext, useContext, useState } from "react";

// export const AuthContext = createContext();

// export const userAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthContextProvider = ({ children }) => {
//   const [authUser, setAuthUser] = useState(
//     JSON.parse(localStorage.getItem("authUser")) || null
//   );

//   const [privateKey, setPrivateKey] = useState(
//     localStorage.getItem("privateKey")
//   );

//   return (
//     <AuthContext.Provider value={{ authUser, setAuthUser, privateKey }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from "react";

// Creating AuthContext
export const AuthContext = createContext();

// Custom hook to access AuthContext
export const userAuth = () => {
  return useContext(AuthContext);
};

// AuthContext Provider component
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("authUser");
      console.log("Stored User from localStorage at authContext:", storedUser); // Check the raw value

      if (storedUser) {
        return JSON.parse(storedUser); // Parse and return if valid
      }
      return null; // Return null if no data exists
    } catch (error) {
      console.error("Error parsing authUser from localStorage", error);
      return null; // Fallback to null if parsing fails
    }
  });

  // Initialize privateKey
  const [privateKey, setPrivateKey] = useState(() => {
    const storedPrivateKey = localStorage.getItem("privateKey");
    return storedPrivateKey || null; // Fallback to null if no private key
  });

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, privateKey }}>
      {children}
    </AuthContext.Provider>
  );
};
