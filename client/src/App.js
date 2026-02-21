import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './App.css'; 

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NEW: State to track if we are logging in or signing up
  const [isSignUpMode, setIsSignUpMode] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // Choose the right URL based on what mode the user is in
    const endpoint = isSignUpMode ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      });

      const data = await response.json(); // Get the message from the backend

      if (response.ok) {
        alert("Success: " + data.message);
        if (isSignUpMode) {
          // If sign up is successful, switch them back to login mode automatically!
          setIsSignUpMode(false);
          setPassword('');
        }
      } else {
        alert("Oops: " + data.message); // Show the error (like "Incorrect password")
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
      });
      if (response.ok) {
        alert("Boom! Google User successfully saved/logged in to MongoDB!");
      }
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

  const handleGoogleError = () => {
    alert("Google Login Failed!");
  };

  return (
    <GoogleOAuthProvider clientId="170992401986-snebs5vrc4c56tdsd03v99halkhiig9r.apps.googleusercontent.com">
      <div className="content-body">
        <div className="form-wrapper">
          <form className="bg-white" onSubmit={handleSubmit}>
            
            {/* Title changes based on mode */}
            <h1 className="text-title">{isSignUpMode ? "Create an Account" : "Login Page"}</h1>
            
            <div className="field-group">
              <label className="label" htmlFor="txt-email">Email address</label>
              <input className="input" type="email" id="txt-email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            <div className="field-group">
              <label className="label" htmlFor="txt-password">Password</label>
              <input className="input" type="password" id="txt-password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {!isSignUpMode && <a href="#forgot" className="link-forgot">Forgot?</a>}
            </div>

            <div className="field-group">
              {/* Button text changes based on mode */}
              <button className="btn-submit" type="submit">
                {isSignUpMode ? "Sign Up" : "Log In"}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px', borderTop: '1px solid #eaeaea', paddingTop: '20px' }}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} shape="rectangular" theme="outline" />
            </div>

          </form>

          <div className="bg-grey">
            {/* This link toggles the mode back and forth! */}
            <a href="#toggle" className="link-register" onClick={(e) => { e.preventDefault(); setIsSignUpMode(!isSignUpMode); }}>
              {isSignUpMode ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </a>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;