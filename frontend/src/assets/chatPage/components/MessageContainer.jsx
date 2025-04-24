import React, { useEffect, useRef, useState } from "react";
import userConversation from "../../../zustand/userConversation";
import { userAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoIosArrowBack } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../../assets/sound/messageNotification.mp3";

const MessageContainer = ({ onBackUser }) => {
  const {
    messages,
    setMessage,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { authUser, setAuthUser } = userAuth();
  const { socket } = useSocketContext();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage([...messages, newMessage]);
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, setMessage, messages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behaviour: "smooth" });
    }, 100);
  }, [messages]);

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

  const handleMessage = (e) => {
    setSendData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(
        `api/message/send/${selectedConversation._id}`,
        { message: sendData }
      );
      console.log(res);
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data);
      }
      setSending(false);
      setSendData("");
      setMessage([...messages, data.data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col py-2">
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
          <div className="flex justify-between gap-1 bg-sky-600 px-2 rounded-lg h-12 mb-4">
            <div className="flex gap-2 justify-between items-center w-full">
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
                    className="rounded-full w-10 h-10 cursor-pointer"
                    src={selectedConversation?.profilePic}
                    alt=""
                  />
                </div>
                <span className="text-gray-950 self-center text-xl font-bold">
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
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
                  className={`chat mb-4 ${
                    message.senderId === authUser._id
                      ? "chat-end pr-0"
                      : "chat-start pl-0"
                  }`}
                >
                  <div className="chat-image avatar"></div>
                  <div
                    className={`flex flex-col ${
                      message.senderId === authUser._id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`chat-bubble p-3 rounded-lg ${
                        message.senderId === authUser._id
                          ? "bg-sky-600 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {message?.message}
                    </div>

                    <div className="text-[10px] opacity-80 text-black mt-1">
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
                </div>
              ))}
          </div>
          <form
            onSubmit={handleSubmit}
            action=""
            className="rounded-full text-black mt-2 px-2"
          >
            <div className="w-full rounded-full flex items-center bg-white">
              <input
                type="text"
                value={sendData}
                onChange={handleMessage}
                required
                id="message"
                className="w-full bg-transparent outline-none px-4 rounded-full"
              />
              <button type="submit">
                {sending ? (
                  <div className="loading loading-spinner"></div>
                ) : (
                  <IoSend
                    size={23}
                    className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1"
                  />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
