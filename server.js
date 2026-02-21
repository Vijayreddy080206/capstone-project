const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = 5000;

const client = new OAuth2Client("170992401986-snebs5vrc4c56tdsd03v99halkhiig9r.apps.googleusercontent.com");

app.use(cors());
app.use(express.json()); 

const mongoURI = 'mongodb://127.0.0.1:27017/myAppDB';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: false }, 
  authProvider: { type: String, default: 'local' }
});

const User = mongoose.model('User', userSchema);

// 1. Sign Up Route (Creates a new user)
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists! Please log in." });
    }

    const newUser = new User({ email, password, authProvider: 'local' });
    await newUser.save();
    console.log("✅ New user signed up:", email);
    res.status(201).json({ message: "Sign up successful! You can now log in." });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing up." });
  }
});

// 2. Log In Route (Checks existing user)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found! Please sign up first." });
    }

    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ message: "This email is a Google account. Click 'Sign in with Google' below." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    console.log("👋 User logged in successfully:", email);
    res.status(200).json({ message: "Login successful! Welcome back." });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in." });
  }
});

// 3. Google Login Route
app.post('/api/google-login', async (req, res) => {
  try {
    const { token } = req.body; 
    
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "170992401986-snebs5vrc4c56tdsd03v99halkhiig9r.apps.googleusercontent.com"
    });
    
    const payload = ticket.getPayload();
    const userEmail = payload.email; 

    let user = await User.findOne({ email: userEmail });
    
    if (!user) {
        user = new User({ email: userEmail, authProvider: 'google' });
        await user.save();
        console.log("✅ New Google user saved:", userEmail);
    } else {
        console.log("👋 Existing Google user logged in:", userEmail);
    }

    res.status(200).json({ message: "Google logic successful!", email: userEmail });
    
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(500).json({ message: "Failed to authenticate with Google." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Backend server is running on http://localhost:${port}`);
});