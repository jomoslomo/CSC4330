const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const PORT = 3001;
let db; 

// Replace this URI with your actual connection string and ensure your credentials are secure
const uri = "mongodb+srv://jomo:jomo@cluster0.wiikuok.mongodb.net/";
const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1
});

app.use(cors());
app.use(bodyParser.json());

// Replace 'your_jwt_secret' with a real secret key stored securely, ideally in environment variables
const jwtSecret = '1234';

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Authorization: Bearer <token>
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const db = client.db("csc4330");

        // Register endpoint
        app.post('/register', async (req, res) => {
            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const usersCollection = db.collection('users');
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            await usersCollection.insertOne({ username, password: hashedPassword });
            res.status(201).json({ message: 'User created successfully' });
        });

        // Login endpoint
        app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ username });
            if (user && await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
                res.json({ message: "Login successful", token });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        });

        // User info endpoint
        app.get('/user-info', verifyToken, async (req, res) => {
            try {
                const userId = req.user.userId;
                const user = await db.collection('users').findOne({ "_id": new ObjectId(userId) });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                const userInfo = {
                    username: user.username,
                    // Add any other user details you want to return here
                };

                res.json(userInfo);
            } catch (error) {
                console.error("Failed to retrieve user info", error);
                res.status(500).json({ message: "Failed to get user information" });
            }
        });

    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }

    db = client.db("csc4330"); // Assign db here

    // Fetch all CPUs
app.get('/cpus', async (req, res) => {
    const collection = db.collection('cpus');
    const cpus = await collection.find({}).toArray();
    res.json(cpus);
});

// Fetch all GPUs
app.get('/gpus', async (req, res) => {
    const collection = db.collection('gpus');
    const gpus = await collection.find({}).toArray();
    res.json(gpus);
});

// Fetch all Memory
app.get('/memory', async (req, res) => {
    const collection = db.collection('memory');
    const memory = await collection.find({}).toArray();
    res.json(memory);
});

// Fetch all Motherboards
app.get('/motherboards', async (req, res) => {
    const collection = db.collection('motherboards');
    const motherboards = await collection.find({}).toArray();
    res.json(motherboards);
});

// Fetch all PSUs
app.get('/psus', async (req, res) => {
    const collection = db.collection('psus');
    const psus = await collection.find({}).toArray();
    res.json(psus);
});

// Fetch all Cases
app.get('/cases', async (req, res) => {
    const collection = db.collection('cases');
    const cases = await collection.find({}).toArray();
    res.json(cases);
});

// Fetch all Internal HDDs
app.get('/internal-hdds', async (req, res) => {
    const collection = db.collection('internal-hdd');
    const internalHDDs = await collection.find({}).toArray();
    res.json(internalHDDs);
});

}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    run().catch(console.dir);
});

//Password Reset

// Express route for handling password reset requests
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    // Find the user by the token in the database
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
});