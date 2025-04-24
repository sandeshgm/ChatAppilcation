import React, { useState } from "react";
import { userAuth } from "../context/AuthContext";
import Sidebar from "./components/SideBar";
import MessageContainer from "./components/MessageContainer";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSideBar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  const backgroundStyle = {
    backgroundImage: 'url("/chat_background.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  };

  return (
    <div style={backgroundStyle}>
      <div
        className="flex w-full h-[90vh] max-w-6xl mx-2 rounded-xl
        shadow-lg bg-white bg-opacity-0 backdrop-blur-lg border border-white/30
        overflow-hidden"
      >
        <div
          className={`${isSidebarVisible ? "w-full md:w-1/3" : "hidden"} 
          transition-all duration-300 ease-in-out`}
        >
          <Sidebar onSelectedUser={handleUserSelect} />
        </div>

        {isSidebarVisible && (
          <div className="hidden md:block w-px bg-gray-300/50"></div>
        )}


        {/*Message Container */}
        <div
          className={`flex-auto bg-gray-200 ${
            selectedUser ? "flex" : "hidden "
          } md:flex }`}
        >
          <MessageContainer onBackUser={handleShowSideBar} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
