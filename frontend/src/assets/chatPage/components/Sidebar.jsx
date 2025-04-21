import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { userAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = userAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchuser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  //show user from the search result
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
      setLoading(false);
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchuser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //show which user is selected
  const handleUserClick = (user) => {
    setSelectedUserId(user._id);
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

  return (
    <div className="flex flex-col h-full px-4 py-2">
      {/* Top bar */}
      <div className="mb-4 flex items-center gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-white rounded-full px-3 py-1 shadow-md transition-all flex-grow"
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
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profilePic}
          alt="profile"
          className="h-10 w-10 rounded-full hover:scale-110 cursor-pointer transition-all"
        />
      </div>

      <div className="divider px-3"></div>

      {/* Users list */}
      <div className="flex-grow overflow-y-auto space-y-2">
        {searchUser?.length > 0 ? (
          searchUser.map((user) => (
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
          chatUser.map((user) => (
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
            className="flex items-center gap-2 cursor-pointer text-black hover:text-red-600"
            onClick={handleLogout}
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
