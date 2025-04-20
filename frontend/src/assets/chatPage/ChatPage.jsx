import React from "react";
import { userAuth } from "../context/AuthContext";
import Sidebar from "./components/SideBar";
import MessageContainer from "./components/MessageContainer";

const ChatPage = () => {
  const { authUser } = userAuth();

  const backgroundStyle = {
    backgroundImage: 'url("/chat_background1.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    color: "#fff",
  };

  return (
    <div style={backgroundStyle}>
      <div
        className="flex justify-between min-w-full md:min-w-[550px]
     md:max-w-[65%] px-2 h-[95%] md:h-full rounded-xl
     shadow-lg bg-gray-400 bg-clip-padding
     backdrop-filter backdrop-blur-lg
     bg-opacity-0"
      >
        <div>
          <Sidebar />
        </div>

        <div>
          <MessageContainer />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
