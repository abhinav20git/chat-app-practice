import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const App = () => {
  const [username, setUserName] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("received-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("message-deleted", (messageId) => {
      setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== messageId));
    });

    return () => {
      socket.off("received-message");
      socket.off("message-deleted");
    };
  }, [messages, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const messageData = {
      id: Date.now(), // Unique ID for each message
      message: newMessage,
      user: username,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    if (newMessage !== "") {
      socket.emit("send-message", messageData);
      setNewMessage("");
    } else {
      alert("Message can not be empty");
    }
  };

  const handleDelete = (messageId) => {
    socket.emit("delete-message", messageId);
  };

  return (
    <>
      <div className="w-screen h-screen  flex justify-center items-center">
        {chatActive ? (
          <div >
            <div className="flex justify-center mb-5">
            <h1 className="font-bold text-fuchsia-800 text-2xl tracking-wider uppercase">
              Chat Application
            </h1>
            </div>
          <div className="rounded-md p-2  border bg-fuchsia-200">
            
            <div>
              <div className="overflow-y-scroll h-[80vh] lg:h-[60vh] ">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex rounded-md shadow-md mr-2 my-5  w-fit ${username === message.user && "ml-auto"}`}
                  >
                    
                    <div className="px-2 bg-white rounded-lg">
                      <span className="text-sm capitalize">{message.user}</span>
                      <h3 className="font-bold">{message.message}</h3>
                      <h3 className="text-xs text-right">{message.time}</h3>
                      {username === message.user && (
                        <button
                          onClick={() => handleDelete(message.id)}
                          className="text-pink-500 text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="flex gap-2 md:gap-4 justify-between "
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="Type Your Message...."
                  className="w-full rounded-md border-2 outline-none px-3 py-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-pink-500 text-white rounded-md font-bold "
                >
                  Send
                </button>
              </form>
            </div>
          </div>
          </div>
        ) : (
          <div className="w-[75vw] h-[80vh] flex justify-center items-center gap-2 border rounded-lg bg-fuchsia-100">
            <div>
            <div className=" mb-20 flex justify-center">
              <h1 className="font-bold text-fuchsia-800 text-2xl tracking-wider">
               Chat Application Assignment
              </h1>
            </div>
            <div className="mt-10  w-[390px] ">
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="text-center px-3 py-2 outline-none border-2 rounded-md mr-5"
            />
            <button
              type="submit"
              className="bg-pink-500 text-white px-3 py-2 rounded-md font-bold"
              onClick={() => username && setChatActive(true)}
            >
              Start Chat
            </button>
            </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
