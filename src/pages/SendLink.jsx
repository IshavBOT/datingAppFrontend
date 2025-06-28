// src/pages/SendLink.jsx
import React, { useState } from "react";
import { auth, sendSignInLinkToEmail } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const actionCodeSettings = {
  url: "http://localhost:3000/complete-signup", // user is redirected here after clicking link in email
  handleCodeInApp: true,
};

export default function SendLink() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendLink = async () => {
    const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+@(dtu|nsut|igdtuw)\.ac\.in$/;
    if (!collegeEmailRegex.test(email)) {
      alert("Please use a valid college email (DTU, NSUT, or IGDTUW).");
      return;
    }

    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setSent(true); // Just set the sent state, don't redirect yet
    } catch (err) {
      console.error("Email link error:", err);
      alert("Failed to send verification link. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-2 sm:p-4">
      <div className="bg-black rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-[400px] md:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden border border-slate-700 mx-auto">
        <div className="bg-black p-4 sm:p-6 md:p-8 text-center text-white">
          <h1 className="m-0 text-3xl sm:text-4xl font-bold tracking-tight text-white font-pacifico" style={{ fontFamily: 'Pacifico, cursive' }}>
            Campus Connect
          </h1>
        </div>
        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="mb-2 text-lg sm:text-xl font-semibold text-white">Get Started</h2>
          <p className="mb-6 text-white text-xs sm:text-sm leading-relaxed">
            Enter your college email to receive a verification link and join the community.
          </p>
          <div className="mb-6">
            <label className="block mb-2 text-xs sm:text-sm font-medium text-white">College Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your college email"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-slate-600 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition disabled:bg-slate-100 bg-black text-white placeholder-slate-400"
              disabled={sent}
            />
            <p className="mt-2 text-xs text-slate-400">
              Only DTU, NSUT, or IGDTUW email addresses are accepted.
            </p>
          </div>
          <button
            onClick={handleSendLink}
            className={`w-full py-2 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition mb-2 ${
              sent
                ? "bg-green-500 cursor-default"
                : "bg-indigo-700 hover:bg-indigo-800 cursor-pointer"
            } ${loading ? "opacity-70" : ""}`}
            disabled={loading || sent}
          >
            {loading ? "Sending..." : sent ? "Link Sent!" : "Send Verification Link"}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition bg-slate-500 hover:bg-slate-600 mt-4"
          >
            Login with Email & Password
          </button>
          {sent && (
            <div className="mt-6 p-3 sm:p-4 bg-green-50 border border-green-300 rounded-lg text-center">
              <p className="m-0 text-green-800 text-xs sm:text-sm font-medium">
                Verification link sent to <strong>{email}</strong>!
              </p>
              <p className="mt-2 text-green-800 text-xs opacity-80">
                Please check your inbox and spam folder.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

