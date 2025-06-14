import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProviver = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      const socket = io("https://sgm-chatapp.onrender.com", {
        //const socket = io("http://localhost:3003/", {
        query: {
          userId: authUser?._id,
        },
      });
      socket.on("getOnlineUsers", (users) => {
        setOnlineUser(users);
      });
      setSocket(socket);
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);
  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
