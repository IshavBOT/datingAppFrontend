import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BsLightbulbFill } from "react-icons/bs";

import SendLink from "./pages/SendLink";
import CompleteSignup from "./pages/CompleteSignup";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SwipePage from "./pages/SwipeCard";
import EditProfile from "./pages/EditProfile";
import Chats from "./pages/Chats";

export const UnreadContext = createContext();

function App() {
  const [unread, setUnread] = useState({});
  const [dark, setDark] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  React.useEffect(() => {
    // Always apply the dark class to <html> for Tailwind dark mode
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <UnreadContext.Provider value={{ unread, setUnread }}>
      <div className={dark ? 'dark bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'}>
        <Router>
          
          <Routes>
            <Route path="/" element={<SendLink />} />
            <Route path="/complete-signup" element={<CompleteSignup />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/swipe" element={<SwipePage />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </Router>
      </div>
    </UnreadContext.Provider>
  );
}

export default App;
