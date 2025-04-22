import React, { useEffect, useRef, useState } from "react";
import userConversation from "../../../zustand/userConversation";
import { userAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";

const MessageContainer = ({ onBackUser }) => {
  const {
    messages,
    setMessage,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { authUser, setAuthUser } = userAuth();
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();

  //for getting messages when we clicked users or friends
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);

      try {
        const get = await axios.get(`/api/message/${selectedConversation._id}`);
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessage(data);
      } catch (error) {
        setLoading(false);
        console.log("error at getMessage Message container", error);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage]);

  return (
    <>
      <div className="md:min-w-[500px] h-full flex flex-col py-2">
        {selectedConversation === null ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2">
              <p className="text-2xl">Welcome, {authUser.username}</p>
              <p className="text-lg">Select a chat to start message</p>
              <TiMessages className="text-6xl text-center" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12 mb-4">
              <div className="flex gap-2 md:justify-between items-center w-full">
                <div className="md:hidden ml-1 self-center">
                  <button
                    onClick={() => onBackUser(true)}
                    className="bg-black rounded-full px-2 py-1 self-center"
                  >
                    <IoIosArrowBack size={24} />
                  </button>
                </div>
                <div className="flex justify-between mr-2 gap-2">
                  <div className="self-center">
                    <img
                      className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                      src={selectedConversation?.profilePic}
                      alt=""
                    />
                  </div>
                  <span className="text-gray-950 self-center text-sm md:text-xl font-bold">
                    {selectedConversation?.username}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {loading && (
                <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                  <div className="loading loading-spinner"></div>
                </div>
              )}
              {!loading && messages?.length === 0 && (
                <p className="text-center text-black items-center py-10">
                  Send a message to start Conversation
                </p>
              )}
              {!loading &&
                messages?.length > 0 &&
                messages?.map((message) => (
                  <div
                    key={message?._id}
                    ref={lastMessageRef}
                    className={`chat ${
                      message.senderId === authUser._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar"></div>
                    <div
                      className={`chat-bubble p-3 rounded-lg ${
                        message.senderId === authUser._id
                          ? "bg-sky-600 text-white"
                          : "bg-gray-600 text-white"
                      }  max-w-[80%]`}
                    >
                      {message?.message}
                    </div>

                    {/* {console.log("Message:", message)}
                    {console.log("Message createdAt:", message?.createdAt)} */}

                    <div className="chat-footer text-[10px] opacity-80 text-black ml-2 py-2">
                      {message?.createdAt ? (
                        !isNaN(new Date(message?.createdAt).getTime()) ? (
                          <>
                            {new Intl.DateTimeFormat("en-IN", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              timeZone: "Asia/Kathmandu",
                            }).format(new Date(message?.createdAt))}
                            <span className="ml-2">
                              {new Intl.DateTimeFormat("en-IN", {
                                hour: "numeric",
                                minute: "numeric",
                                timeZone: "Asia/Kathmandu",
                              }).format(new Date(message?.createdAt))}
                            </span>
                          </>
                        ) : (
                          <span className="text-red-500">Invalid Date</span>
                        )
                      ) : (
                        <span className="text-gray-500">
                          Date not available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MessageContainer;
