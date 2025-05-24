import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userConversation from "../../../zustand/userConversation";
import { useSocketContext } from "../../context/SocketContext";

const Sidebar = ({ onSelectedUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchuser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      console.log("received message from socket", newMessage);
      setNewMessageUsers(newMessage);
    };
    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, messages]);

  //show user with where you chatted
  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentChatters`);
        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);

  // handle search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchuser(data);
      }

      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchuser(data);
      }
    } catch (error) {
      toast.error("Search request failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //show which user is selected
  const handleUserClick = (user) => {
    onSelectedUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
  };

  //back from search result
  const handleSearchBack = () => {
    setSearchuser([]);
    setSearchInput("");
  };

  //logout
  const handleLogout = async () => {
    const confirmLogout = window.prompt("type 'UserName' to Logout");
    if (confirmLogout === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        toast.info(data?.message);

        localStorage.removeItem("authUser");
        localStorage.removeItem("privateKey");
        setAuthUser(null);

        setLoading(false);

        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log("logout", error);
      }
    } else {
      toast.info("Logout cancelled!");
    }
  };
  console.log("searchUser data:", searchUser);
  console.log("chatUser data:", chatUser);

  return (
    <div className="flex flex-col h-full px-4 py-2 border-r-2 border-gray-300">
      {loading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
    <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>
    <div className="relative">
      <div className="loading loading-spinner loading-lg text-black"></div>
    </div>
  </div>
)}


      {/* Top bar */}
      <div className="mb-4 flex items-center gap-4">
        {/* <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-white rounded-full px-2 py-1 shadow-md w-full sm:max-w-sm"
          style={{ width: "70%" }}
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="flex-grow px-4 py-2 text-black bg-transparent outline-none rounded-s-full placeholder-gray-500"
            placeholder="Search user"
          />
          <button
            type="submit"
            className="ml-2 w-9 h-9 flex items-center justify-center rounded-full bg-sky-700 hover:bg-gray-950 text-white transition-all"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm text-white"></span>
            ) : (
              <FaSearch />
            )}
          </button>
        </form> */}

        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="w-full pl-4 pr-10 py-2 text-black rounded-full bg-white shadow-md placeholder-gray-500 focus:outline-none"
            placeholder="Search user"
          />
          <button
            type="submit"
            disabled={loading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 text-sky-700 hover:text-gray-950 ${
              loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm text-sky-700"></span>
            ) : (
              <FaSearch />
            )}
          </button>
        </form>
      </div>

      <div className="divider px-3"></div>

      {/* Users list */}
      <div className="flex-grow overflow-y-auto space-y-2">
        {searchUser?.length > 0 ? (
          searchUser.map((user, index) => (
            <div key={user._id} className="w-full">
              <div
                onClick={() => handleUserClick(user)}
                className={`flex gap-3 items-center p-2 cursor-pointer transition-all w-full 
                  ${
                    selectedUserId === user?._id
                      ? "bg-sky-500"
                      : "hover:bg-sky-100"
                  }`}
              >
                {/*Socket is Online */}
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src={user?.profilePic} alt="user.img" />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <p className=" text-black">{user.username}</p>
                </div>
              </div>
              <div className="divider px-3"></div>
            </div>
          ))
        ) : chatUser.length === 0 ? (
          <div className="font-bold items-center flex flex-col text-xl text-yellow-500 mt-4">
            <h1>Why are you Alone!!🤔</h1>
            <h1>Search username to chat</h1>
          </div>
        ) : (
          chatUser.map((user, index) => (
            <div key={user._id} className="w-full">
              <div
                onClick={() => handleUserClick(user)}
                className={`flex gap-3 items-center p-2 cursor-pointer transition-all w-full 
                  ${
                    selectedUserId === user?._id
                      ? "bg-sky-500"
                      : "hover:bg-sky-100"
                  }`}
              >
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src={user?.profilePic} alt="user.img" />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <p className=" text-black">{user.username}</p>
                </div>

                {/*notification */}
                {/* <div>
                  {newMessageUsers.receiverId === authUser._id &&
                  newMessageUsers.senderId === user._id ? (
                    <div className="founded-full bg-green-700 text-sm text-white px-[4px}">
                      +1
                    </div>
                  ) : (
                    <></>
                  )}
                </div> */}
              </div>
              <div className="divider px-3"></div>
            </div>
          ))
        )}
      </div>

      {/* Bottom actions */}
      <div className="pt-4 mt-auto">
        {searchUser.length > 0 ? (
          <div
            className="flex items-center gap-2 cursor-pointer text-black hover:text-gray-700"
            onClick={handleSearchBack}
          >
            <IoIosArrowBack size={22} />
            <span className="text-sm font-medium">Back</span>
          </div>
        ) : (
          <div
            onClick={handleLogout}
            disabled={loading}
            className={`flex items-center gap-2 text-black hover:text-red-600 ${
              loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            <FiLogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
