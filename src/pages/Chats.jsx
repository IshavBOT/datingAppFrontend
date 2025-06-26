import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { UnreadContext } from "../App";

const SOCKET_URL = "http://localhost:5000";

export default function Chats() {
  const [matches, setMatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const { unread, setUnread } = useContext(UnreadContext);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch profile and matches
  useEffect(() => {
    const fetchProfileAndMatches = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        alert("No email found. Please log in.");
        navigate("/login");
        return;
      }
      const res = await fetch(`http://localhost:5000/api/profile/get?email=${email}`);
      const data = await res.json();
      setProfile(data);
      // Fetch matches
      const matchRes = await fetch(`http://localhost:5000/api/matches?userId=${data._id}`);
      const matchData = await matchRes.json();
      setMatches(matchData.matches || []);
    };
    fetchProfileAndMatches();
  }, [navigate]);

  // Fetch chat history when user selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !profile) return;
      const res = await fetch(
        `http://localhost:5000/api/messages/${profile._id}/${selectedUser._id}`
      );
      let data = await res.json();
      // Normalize messages to always have 'from' and 'to'
      data = data.map((msg) => ({
        ...msg,
        from: msg.sender || msg.from,
        to: msg.receiver || msg.to,
      }));
      setMessages(data);
      setUnread((prev) => ({ ...prev, [selectedUser._id]: 0 }));
    };
    fetchMessages();
  }, [selectedUser, profile, setUnread]);

  // Initialize socket
  useEffect(() => {
    if (!profile) return;
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("register", profile._id);
    socketRef.current.off("receive_message");
    socketRef.current.on("receive_message", (msg) => {
      // Only add to state if you are the receiver
      if (msg.to === profile._id) {
        // If chat is open with sender, show instantly
        if (selectedUser && msg.from === selectedUser._id) {
          setMessages((prev) => [...prev, msg]);
        } else {
          // If chat is not open, increment unread
          setUnread((prev) => {
            const count = (prev[msg.from] || 0) + 1;
            return { ...prev, [msg.from]: count };
          });
        }
      }
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [profile, selectedUser, setUnread]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    const msgObj = {
      from: profile._id,
      to: selectedUser._id,
      message: newMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msgObj]); // Optimistically add to state
    socketRef.current.emit("send_message", msgObj);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-8 px-2">
        <h2 className="font-bold text-2xl mb-6 text-gray-900 dark:text-gray-100">Chats</h2>
        {matches.length === 0 && <p className="text-gray-500 dark:text-gray-400">No matches yet.</p>}
        <ul className="w-full flex-1 overflow-y-auto">
          {matches.map((user) => (
            <li
              key={user._id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer mb-2 transition-colors ${selectedUser?._id === user._id ? "bg-indigo-100 dark:bg-indigo-900" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              onClick={() => setSelectedUser(user)}
            >
              <img src={user.photoURL} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              <span className="flex-1 text-gray-900 dark:text-gray-100">{user.name}</span>
              {unread[user._id] > 0 && (
                <span className="ml-2 inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </li>
          ))}
        </ul>
        <button className="mt-4 px-4 py-2 rounded bg-indigo-600 text-white font-semibold" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-50 dark:bg-gray-900">
        {selectedUser ? (
          <>
            <div className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700 w-full justify-center">
              <img src={selectedUser.photoURL} alt={selectedUser.name} className="w-12 h-12 rounded-full object-cover" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{selectedUser.name}</h3>
            </div>
            <div className="flex-1 w-full max-w-2xl px-4 py-2 overflow-y-auto min-h-[300px]" style={{height: 'calc(100vh - 200px)'}}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 flex ${msg.from === profile._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] text-base px-4 py-2 rounded-2xl shadow-md ${
                      msg.from === profile._id
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-indigo-100 dark:bg-indigo-900 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                    }`}
                  >
                    <span>{msg.message}</span>
                    <div className="text-xs text-right text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="flex w-full max-w-2xl px-4 py-3 gap-2" onSubmit={handleSend}>
              <input
                className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold" type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="text-gray-400 text-xl text-center">Select a match to start chatting.</div>
        )}
      </div>
    </div>
  );
} 