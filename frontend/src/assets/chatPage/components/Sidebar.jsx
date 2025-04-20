import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { userAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const { authUser } = userAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchuser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  console.log(chatUser);

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

  const handleUserClick = (user) => {
    setSelectedUserId(user._id);
  };
  console.log(searchUser);

  return (
    <div className="h-full w-full px-4 py-2">
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
      {searchUser?.length > 0 ? (
        <></>
      ) : (
        <>
          <div className="h-10 w-10 rounded-full hover:scale-110 cursor-pointer transition-all">
            <div className="w-auto">
              {chatUser.length === 0 ? (
                <>
                  <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                    <h1>Why are you Alone!!🤔</h1>
                    <h1>Search username to chat</h1>
                  </div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => (
                    <div key={user._id}>
                      <div
                        onClick={() => handleUserClick(user)}
                        className={`flex gap-3 items-center rounded p-2 cursor-pointer
                            ${
                              selectedUserId === user?._id ? "bg-sky-500" : ""
                            }`}
                      >
                        <div className="avatar">
                          <div className="w-12 rounded-full">
                            <img src={user?.profilePic} alt="user.img" />
                          </div>
                          <div className="flex flex-col flex-1">
                            <p className="font-bold text-white-900">
                              {user.username}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="divider px-3"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
