import React, { useState, useEffect } from 'react';
import './MessagesPage.css'; // Ensure you have this CSS file for styling

// RecipientSelector Component
function RecipientSelector({ users, selectedUserId, onUserSelect }) {
    return (
        <div className="recipientSelection">
            {users.map((user) => (
                <label key={user._id}>
                    <input
                        type="radio"
                        name="recipientId"
                        value={user._id}
                        checked={selectedUserId === user._id}
                        onChange={() => onUserSelect(user._id)}
                        style={{ display: 'none' }} // Hide the default radio button
                    />
                    <span>{user.username}</span>
                </label>
            ))}
        </div>
    );
}

function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]); // State to store fetched users
    const [messageContent, setMessageContent] = useState('');
    const [recipientId, setRecipientId] = useState(''); // ID of the selected recipient
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchMessages();
        fetchUsers();
    }, []);

    const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/messages', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setMessages(data);
        } else {
            console.error('Failed to fetch messages');
            setFeedback('Failed to fetch messages. Please try again later.');
        }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        } else {
            console.error('Failed to fetch users');
            setFeedback('Failed to fetch users. Please try again later.');
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                receiverId: recipientId,
                content: messageContent,
            })
        });

        if (response.ok) {
            setMessageContent('');
            setRecipientId('');
            setFeedback('Message sent successfully.');
            fetchMessages(); // Optionally re-fetch messages to update the list
        } else {
            console.error('Failed to send message');
            setFeedback('Failed to send message. Please try again.');
        }
    };

    // Function to filter messages for the selected recipient
    const filteredMessages = messages.filter(message => message.senderId === recipientId || message.receiverId === recipientId);

    return (
        <div className="messagesPageContainer">
            <div className="recipientSelectorContainer">
                <RecipientSelector users={users} selectedUserId={recipientId} onUserSelect={setRecipientId} />
            </div>
            <div className="messagesContent">
                <h2>Messages</h2>
                {feedback && <div className="feedback">{feedback}</div>}
                {recipientId && (
                    <div className="messagesList">
                        {filteredMessages.map((message) => (
                            <div key={message._id} className="message">
                                <p><strong>From:</strong> {users.find(user => user._id === message.senderId)?.username || 'Unknown User'} <strong>To:</strong> {users.find(user => user._id === message.receiverId)?.username || 'Unknown User'}</p>
                                <p>{message.content}</p>
                            </div>
                        ))}
                    </div>
                )}
                <form onSubmit={sendMessage}>
                    <textarea 
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Write your message here..."
                        required
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );

}

export default MessagesPage;
