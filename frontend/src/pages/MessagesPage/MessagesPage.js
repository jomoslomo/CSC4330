import React, { useState, useEffect } from 'react';
import './MessagesPage.css';

function RecipientSelector({ friends, selectedUserId, onUserSelect }) {
  return (
    <div className="recipientSelection">
      {friends.map((friend) => (
        <label key={friend._id} className="recipientLabel">
          <input
            type="radio"
            name="recipientId"
            value={friend._id}
            checked={selectedUserId === friend._id}
            onChange={() => onUserSelect(friend._id)}
            style={{ display: 'none' }} // Hide the default radio button
          />
          <span>{friend.username}</span>
        </label>
      ))}
    </div>
  );
}

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]); // State to store fetched friends
  const [builds, setBuilds] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [recipientId, setRecipientId] = useState(localStorage.getItem('selectedRecipientId') || ''); // Get the initial value from local storage
  const [buildId, setBuildId] = useState('');
  const [feedback, setFeedback] = useState('');
  const loggedInUsername = localStorage.getItem('username'); // Retrieve logged-in username

  useEffect(() => {
    fetchResources();
    localStorage.setItem('selectedRecipientId', recipientId);
  }, [recipientId]);

  const fetchResources = async () => {
    fetchData('messages', setMessages);
    fetchData('friends/list', setFriends);
    fetchData('user/builds', setBuilds);
  };

  const fetchData = async (endpoint, setter) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        const data = await response.json();
        setter(data);
    } else {
        console.error(`Failed to fetch ${endpoint}`);
        setFeedback(`Failed to fetch ${endpoint}. Please try again later.`);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Prepare the message payload, conditionally including the buildId if selected
    const messagePayload = {
        receiverId: recipientId,
        content: messageContent,
    };

    // Only add buildId to the payload if it has been set (i.e., it is not an empty string)
    if (buildId) {
        messagePayload.buildId = buildId;
    }

    const response = await fetch('http://localhost:3001/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messagePayload)
    });

    if (response.ok) {
        const newMessage = await response.json();
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessageContent('');
        setBuildId('');  // Reset build selection
        setFeedback('Message sent successfully.');
        window.location.reload();

    } else {
        const errorData = await response.text();  // or response.json() if the response is in JSON format
        console.error('Failed to send message', errorData);
        setFeedback(`Failed to send message: ${errorData}. Please try again.`);
    }
};


  return (
    <div className="messagesPageContainer">
      <div className="recipientSelectorContainer">
        <RecipientSelector friends={friends} selectedUserId={recipientId} onUserSelect={setRecipientId} />
      </div>
      <div className="messagesContent">
        <h2>Messages</h2>
        {feedback && <div className="feedback">{feedback}</div>}
        {recipientId && (
        <div className="messagesList">
        {messages.filter(message => message.senderId === recipientId || message.receiverId === recipientId)
          .reverse() // Reverse the order of the messages array
          .map((message, index, reversedMessages) => (
            <div key={message._id} className={`message ${message.senderId === recipientId ? 'messageLeft' : 'messageRight'}`}>
              {(index === reversedMessages.length - 1 || reversedMessages[index + 1].senderId !== message.senderId) && (
                <div className="messageHeader">
                  {message.senderId === recipientId ? friends.find(friend => friend._id === message.senderId)?.username : loggedInUsername}
                </div>
              )}
              <div className="messageBubble">{message.content}</div>
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
<select
    value={buildId}
    onChange={(e) => setBuildId(e.target.value)}
    required={false}  // This ensures that the form can be submitted even if no build is selected
>
    <option value="">Select a Build (Optional)</option>
    {builds.map((build) => (
        <option key={build._id} value={build._id}>{build.build_name}</option>
    ))}
</select>

        <button type="submit">Send</button>
    </form>
      </div>
    </div>
  );
}

export default MessagesPage;
