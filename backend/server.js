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


    // Endpoint to get a list of users
app.get('/users', verifyToken, async (req, res) => {
    try {
        // Fetch users from the database
        const users = await db.collection('users').find({}, {
            projection: { password: 0 } // Exclude the password field from the results
        }).toArray();

        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ message: "No users found" });
        }
    } catch (error) {
        console.error("Failed to retrieve users", error);
        res.status(500).json({ message: "Failed to retrieve users" });
    }
});


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

        // Construct the build object with a unique _id
        const build = {
            _id: new ObjectId(), // This generates a new unique identifier for each build
            build_name: build_name,
            components: components,
            user_id: new ObjectId(userId) // Include the user ID in the build document
        };

        // Insert the build into the builds collection
        const buildResult = await db.collection('builds').insertOne(build);
        console.log("Build insertion result:", buildResult); // Log the result of the build insertion

        // Update the user document to add the build to the builds array
        const userUpdateResult = await db.collection('users').updateOne(
            { "_id": new ObjectId(userId) },
            { $push: { builds: build } }
        );
        console.log("User update result:", userUpdateResult); // Log the result of the user update

        // Check if both the build insertion and user update were successful
        if (buildResult.acknowledged && userUpdateResult.modifiedCount === 1) {
            res.status(201).json({ message: 'User build created successfully', buildId: build._id });
        } else {
            res.status(500).json({ message: 'Failed to create user build' });
        }
    } catch (error) {
        console.error("Failed to create user build", error);
        res.status(500).json({ message: "Failed to create user build", errorDetails: error.message });
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


app.post('/share-build', verifyToken, async (req, res) => {
    const { buildId, recipientUsername } = req.body;
    const ownerId = req.user.userId;

    try {
        // Confirm the build exists and belongs to the logged-in user
        const build = await db.collection('builds').findOne({ _id: new ObjectId(buildId), user_id: new ObjectId(ownerId) });
        if (!build) {
            return res.status(404).json({ message: "Build not found or access denied" });
        }

        // Get recipient user data
        const recipient = await db.collection('users').findOne({ username: recipientUsername });
        if (!recipient) {
            return res.status(404).json({ message: "Recipient user not found" });
        }

        // Check for existing share to prevent duplicates
        const existingShare = await db.collection('sharedBuilds').findOne({ buildId: new ObjectId(buildId), recipientId: recipient._id });
        if (existingShare) {
            return res.status(409).json({ message: "Build already shared with this user" });
        }

        // Create the share
        const share = {
            buildId: new ObjectId(buildId),
            ownerId: new ObjectId(ownerId),
            recipientId: recipient._id,
            sharedAt: new Date()
        };
        await db.collection('sharedBuilds').insertOne(share);

        res.status(201).json({ message: "Build shared successfully" });
    } catch (error) {
        console.error("Error sharing build:", error);
        res.status(500).json({ message: "Error sharing build", error: error.message });
    }
});

app.get('/received-builds', verifyToken, async (req, res) => {
    const recipientId = req.user.userId;

    try {
        // Fetch all builds shared with the logged-in user
        const shares = await db.collection('sharedBuilds').find({ recipientId: new ObjectId(recipientId) }).toArray();
        if (!shares.length) {
            return res.status(404).json({ message: "No builds shared with you" });
        }

        // Optionally, fetch detailed information about each shared build
        const builds = await Promise.all(shares.map(async (share) => {
            return await db.collection('builds').findOne({ _id: share.buildId });
        }));

        res.status(200).json(builds);
    } catch (error) {
        console.error("Error retrieving shared builds:", error);
        res.status(500).json({ message: "Error retrieving shared builds", error: error.message });
    }
});


// Endpoint to get messages for the authenticated user
app.get('/messages', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming the JWT includes userId
        
        // Optional: Get the other user's ID from query parameters if you want to fetch messages from a specific conversation
        const otherUserId = req.query.otherUserId;
        
        let query = {
            $or: [
                { senderId: new ObjectId(userId), receiverId: new ObjectId(otherUserId) },
                { senderId: new ObjectId(otherUserId), receiverId: new ObjectId(userId) }
            ]
        };

        // If no specific otherUserId is provided, adjust the query to fetch all messages for the user
        if (!otherUserId) {
            query = {
                $or: [
                    { senderId: new ObjectId(userId) },
                    { receiverId: new ObjectId(userId) }
                ]
            };
        }

        const messages = await db.collection('messages').find(query).sort({ createdAt: -1 }).toArray();
        
        res.json(messages);
    } catch (error) {
        console.error("Failed to retrieve messages", error);
        res.status(500).json({ message: "Failed to retrieve messages" });
    }
});

const { ObjectId } = require('mongodb');

// Helper function to check if a string is a valid ObjectId
function isValidObjectId(id) {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

// Endpoint to post a new message
app.post('/messages', verifyToken, async (req, res) => {
    try {
        const senderId = req.user.userId; // Extracted from the verified token
        const { receiverId, content, buildId } = req.body;

        // Basic validation for receiverId and content
        if (!receiverId || !content) {
            return res.status(400).json({ message: "Missing receiver ID or content" });
        }

        // Validation for senderId and receiverId to be valid ObjectIds
        if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
            return res.status(400).json({ message: "Invalid sender or receiver ID" });
        }

        const message = {
            senderId: new ObjectId(senderId),
            receiverId: new ObjectId(receiverId),
            content: content,
            createdAt: new Date(),
            read: false
        };

        // Check if a buildId is provided and it is a valid ObjectId
        if (buildId && isValidObjectId(buildId)) {
            message.buildId = new ObjectId(buildId);
        } else if (buildId) { // If buildId is provided but invalid, return an error
            return res.status(400).json({ message: "Invalid build ID" });
        }

        const result = await db.collection('messages').insertOne(message);

        // Check if the message was successfully inserted
        if (result.acknowledged) {
            res.status(201).json({ message: 'Message sent successfully', messageId: result.insertedId });
        } else {
            res.status(500).json({ message: 'Failed to send message' });
        }
    } catch (error) {
        console.error("Failed to send message", error);
        res.status(500).json({ message: "Failed to send message" });
    }
});


// Search for users by username
app.get('/search-users', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: "Username query is required." });
    }

    try {
        const user = await db.collection('users').findOne({ username: username });
        if (user) {
            // For privacy, don't send back the password, even if it's hashed
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.error("Error searching for user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


app.post('/friends/requests', verifyToken, async (req, res) => {
    try {
        const senderId = req.user.userId; // Extracted from the verified token
        const { username } = req.body; // Now expecting a username
        
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }
        
        // Find the recipient user by username
        const recipient = await db.collection('users').findOne({ username: username });
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient user not found' });
        }
        const recipientId = recipient._id.toString();
        
        // Prevent users from sending requests to themselves
        if (senderId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        // Check if there's already an existing request between these two users
        const existingRequest = await db.collection('friendships').findOne({
            $or: [
                { user1: new ObjectId(senderId), user2: new ObjectId(recipientId) },
                { user1: new ObjectId(recipientId), user2: new ObjectId(senderId) }
            ]
        });

        if (existingRequest) {
            // You can refine this by checking the status and customizing the message accordingly
            return res.status(400).json({ message: 'A friend request already exists between you two' });
        }

        // Create a new friend request
        const friendRequest = {
            user1: new ObjectId(senderId),
            user2: new ObjectId(recipientId),
            status: 'pending',
            createdAt: new Date(),
        };

        const result = await db.collection('friendships').insertOne(friendRequest);

        if (result.acknowledged) {
            res.status(201).json({ message: 'Friend request sent successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send friend request' });
        }
    } catch (error) {
        console.error('Failed to send friend request', error);
        res.status(500).json({ message: 'Failed to send friend request' });
    }
});


app.post('/friends/update', verifyToken, async (req, res) => {
    const { requestId, action } = req.body; // action can be 'accept' or 'decline'
    
    if (!requestId || !action) {
        return res.status(400).json({ message: "Request ID and action are required." });
    }
    
    const validActions = ['accept', 'decline'];
    if (!validActions.includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'accept' or 'decline'." });
    }
    
    const newStatus = action === 'accept' ? 'accepted' : 'declined';
    
    try {
        // Retrieve the friend request to check if the current user is the recipient
        const request = await db.collection('friendships').findOne({ _id: new ObjectId(requestId) });
        
        if (!request) {
            return res.status(404).json({ message: "Friend request not found." });
        }
        
        // Ensure the current user is the recipient of the friend request
        if (request.user2.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Only the recipient of the friend request can accept or decline it." });
        }

        // Attempt to update the friend request
        const result = await db.collection('friendships').updateOne(
            { 
                _id: new ObjectId(requestId),
                status: 'pending' // Ensures we only update requests that are still pending
            },
            { 
                $set: { status: newStatus } 
            }
        );
        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Friend request not found or not in a pending state." });
        }
        
        res.json({ message: `Friend request ${newStatus} successfully.` });
    } catch (error) {
        console.error(`Failed to ${action} friend request`, error);
        res.status(500).json({ message: `Failed to ${action} friend request.` });
    }
});

app.get('/friends/requests', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the verified token

        // Fetch all friend requests involving the current user
        let friendRequests = await db.collection('friendships').find({
            $or: [{ user1: new ObjectId(userId) }, { user2: new ObjectId(userId) }],
            status: 'pending'
        }).toArray();

        // Enrich each friend request with details about the other user
        friendRequests = await Promise.all(friendRequests.map(async (request) => {
            // Determine if the request is outgoing or incoming
            const isOutgoing = request.user1.toString() === userId;
            // Find the ID of the other user involved in the request
            const otherUserId = isOutgoing ? request.user2 : request.user1;
            // Fetch the other user's details
            const otherUser = await db.collection('users').findOne({ _id: new ObjectId(otherUserId) });
            // Return the enriched friend request
            return {
                ...request,
                isOutgoing,
                otherUserId: otherUserId.toString(), // Include the other user's ID for reference
                otherUsername: otherUser.username, // Include the other user's username for the frontend
            };
        }));

        res.json(friendRequests);
    } catch (error) {
        console.error('Failed to retrieve friend requests', error);
        res.status(500).json({ message: 'Failed to retrieve friend requests' });
    }
});



// ...

// Endpoint to get a user's friend list
app.get('/friends/list', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from the verified token

        // Find all accepted friend requests where the user is either the sender or recipient
        const friends = await db.collection('friendships').find({
            $and: [
                { $or: [{ user1: new ObjectId(userId) }, { user2: new ObjectId(userId) }] },
                { status: 'accepted' }
            ]
        }).toArray();

        // Prepare an array to store friend user IDs
        let friendIds = [];

        // Iterate through the friends array and add friend user IDs to the friendIds array
        friends.forEach(friendship => {
            if (friendship.user1.toString() === userId) {
                friendIds.push(friendship.user2);
            } else {
                friendIds.push(friendship.user1);
            }
        });

        // Find user details for the friend user IDs
        const friendDetails = await db.collection('users').find({ _id: { $in: friendIds } }).toArray();

        res.json(friendDetails);
    } catch (error) {
        console.error('Failed to retrieve friend list', error);
        res.status(500).json({ message: 'Failed to retrieve friend list' });
    }
});

}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    run().catch(console.dir);
});


