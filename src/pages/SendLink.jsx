// src/pages/SendLink.jsx
import React, { useState } from "react";
import { auth, sendSignInLinkToEmail } from "../firebaseConfig";

const actionCodeSettings = {
  url: "http://localhost:3000/complete-signup", // Redirect after link click
  handleCodeInApp: true,
};

export default function SendLink() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendLink = async () => {
    if (!email.endsWith("@dtu.ac.in") && !email.endsWith("@nsut.ac.in") && !email.endsWith("@igdtuw.ac.in")) {
      alert("Use your college email only");
      return;
    }

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setSent(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Verify Your College Email</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter college email" />
      <button onClick={handleSendLink}>Send Verification Link</button>
      {sent && <p>Verification link sent! Check your inbox.</p>}
    </div>
  );
}
