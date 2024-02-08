const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = 3001;

const uri = "mongodb+srv://jomo:jomo@cluster0.wiikuok.mongodb.net/";
const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1
});

app.use(cors());
app.use(bodyParser.json());

// Replace 'your_jwt_secret' with a real secret key stored safely
const jwtSecret = '1234';

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

    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    run().catch(console.dir);
});
