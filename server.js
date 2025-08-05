const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/userModel');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB URI dla Mongo Compass
const MONGODB_URI = 'mongodb://localhost:27017/cryptotracker';

// Connect to MongoDB FIRST
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit if can't connect to DB
    });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serwuj pliki statyczne

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running!',
        mongodb_uri: MONGODB_URI,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// API - Register user
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Walidacja
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Sprawdź długość hasła
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }
        
        // Sprawdź długość username
        if (username.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username must be at least 3 characters long' 
            });
        }
        
        // Sprawdź czy user już istnieje
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }
        
        // Utwórz nowego usera
        const newUser = new User({
            username,
            email,
            password // W produkcji należy zahashować!
        });
        
        await newUser.save();
        
        console.log('✅ User registered:', username);
        
        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email 
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: `Validation error: ${error.message}` 
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username or email already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error'
        });
    }
});

// API - Login user 

app.post('/api/login', async (req, res) => {

    try {
        const { email, password } = req.body;

        // Walidacja
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Znajdź użytkownika
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Sprawdź hasło (w produkcji należy użyć bcrypt)
        if (user.password !== password) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid password' 
            });
        }

        console.log('✅ User logged in:', user.username);

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error'
        });
    }
});

// API - Change password
app.post('/api/change-password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        
        // Walidacja danych
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email, old password and new password are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters long' 
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be different from old password' 
            });
        }

        // Znajdź użytkownika
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Sprawdź stare hasło
        if (user.password !== oldPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid old password' 
            });
        }

        // Zaktualizuj hasło
        user.password = newPassword; // W produkcji należy zahashować!
        user.passwordChangedAt = new Date();
        await user.save();

        console.log('✅ Password changed for user:', user.username);

        res.json({ 
            success: true, 
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error'
        });
    }
});