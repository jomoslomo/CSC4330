const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dreamsbuilding508@gmail.com', // Your Gmail email address
        pass: 'apdk izdt hdei onch ' // Your Gmail password or application-specific password
    }
});

// Function to send email
async function sendEmail(recipient, subject, message) {
    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Your Application" <dreamsbuilding508@gmail.com>',
            to: recipient,
            subject: subject,
            text: message
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Test usage
//sendEmail('recipient@example.com', 'Test Email', 'This is a test email from Node.js')

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const db = client.db("csc4330");

        // Register endpoint
        app.post('/register', async (req, res) => {
            const { username, password, email } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const usersCollection = db.collection('users');
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            await usersCollection.insertOne({ username, password: hashedPassword, email });
            res.status(201).json({ message: 'User created successfully' });
            // Send registration confirmation email
            sendEmail(email, 'Registration Confirmation', 'Thank you for registering with our application.');


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

// Assuming `db` is your MongoDB connection object

// Endpoint to create a user build
app.post('/user/builds', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { build_name, components } = req.body;

        // Construct the build object
        const build = {
            build_name: build_name,
            components: components
        };

        // Update the user document to add the build to the builds array
        const result = await db.collection('users').updateOne(
            { "_id": new ObjectId(userId) },
            { $push: { builds: build } }
        );

        // Check if the update was successful
        if (result.modifiedCount === 1) {
            res.status(201).json({ message: 'User build created successfully' });
        } else {
            res.status(500).json({ message: 'Failed to create user build' });
        }
    } catch (error) {
        console.error("Failed to create user build", error);
        res.status(500).json({ message: "Failed to create user build" });
    }
});

// Endpoint to get user builds
app.get('/user/builds', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Retrieve the user document with builds
        const user = await db.collection('users').findOne({ "_id": new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract and return the builds array
        const builds = user.builds || [];
        res.json(builds);
    } catch (error) {
        console.error("Failed to get user builds", error);
        res.status(500).json({ message: "Failed to get user builds" });
    }
});


}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    run().catch(console.dir);
});