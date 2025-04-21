import React from "react";
import { userAuth } from "../context/AuthContext";
import Sidebar from "./components/SideBar";
import MessageContainer from "./components/MessageContainer";

const ChatPage = () => {
  const { authUser } = userAuth();

  const backgroundStyle = {
    backgroundImage: 'url("/chat_background.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    paddingTop: "2rem",     // adds space at top
    paddingBottom: "2rem",  // adds space at bottom
    display: "flex",
    justifyContent: "center",
    color: "#fff",
  };

  return (
    <div style={backgroundStyle}>
      <div
        className="flex justify-between w-full md:min-w-[550px]
        md:max-w-[65%] px-2 h-[90vh] rounded-xl
        shadow-lg bg-white bg-opacity-20
        backdrop-blur-lg border border-white/30"
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
