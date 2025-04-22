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
    paddingTop: "2rem",
    paddingBottom: "2rem",
    display: "flex",
    justifyContent: "center",
    color: "#fff",
  };

  return (
    <div style={backgroundStyle}>
      <div
        className="flex justify-between w-full md:min-w-[550px]
        md:max-w-[65%] px-2 h-[90vh] rounded-xl
        shadow-lg bg-white bg-opacity-0 
        backdrop-blur-lg border border-white/30"
      >
        <div
          className={`w-full py-2 md:flex transition-all ${
            isSidebarVisible ? "flex" : "hidden"
          }`}
        >
          <Sidebar onSelectedUser={handleUserSelect} />
        </div>

        <div
          className={`divider divider-horizontal px-3 hidden md:block  ${
            isSidebarVisible ? "block" : "hidden"
          }  `}
        ></div>
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
