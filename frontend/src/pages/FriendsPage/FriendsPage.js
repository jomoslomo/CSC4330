import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendsPage.css';

const FriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/search-users?username=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSearchResults(Array.isArray(response.data) ? response.data : [response.data]);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error searching for users:', error);
      setSearchResults([]);
    }
  };

  const handleSendRequest = (username) => {
    axios.post('http://localhost:3001/friends/requests', { username }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => {
        fetchFriendRequests();
      })
      .catch((error) => {
        console.error('Error sending friend request:', error);
      });
  };

  const fetchFriendRequests = () => {
    axios.get('http://localhost:3001/friends/requests', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((response) => {
        setFriendRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching friend requests:', error);
      });
  };

  const fetchFriends = () => {
    axios.get('http://localhost:3001/friends/list', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((response) => {
        setFriends(response.data);
      })
      .catch((error) => {
        console.error('Error fetching friends:', error);
      });
  };

  const updateFriendRequestStatus = (requestId, action) => {
    axios.post('http://localhost:3001/friends/update', { requestId, action }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => {
        fetchFriendRequests();
      })
      .catch((error) => {
        console.error(`Error ${action}ing friend request:`, error);
      });
  };

  const incomingRequests = friendRequests.filter(request => !request.isOutgoing);
  const outgoingRequests = friendRequests.filter(request => request.isOutgoing);

  return (
    <div className="friends-page">
      <h2>Friends</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      {searchPerformed && searchResults.length > 0 && (
        <ul className="friend-list">
          {searchResults.map((user) => (
            <li key={user._id} className="friend-item">
              <span className="friend-name">{user.username}</span>
              <div className="friend-actions">
                <button onClick={() => handleSendRequest(user.username)}>Send Request</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {searchPerformed && searchResults.length === 0 && <p>No users found matching the search query.</p>}
      <div className="requests-container">
        <div className="incoming-requests">
          <h3>Incoming Friend Requests</h3>
          {incomingRequests.map(request => (
            <div key={request._id} className="request-item">
              <p>From: {request.otherUsername}</p>
              <div className="actions">
                <button onClick={() => updateFriendRequestStatus(request._id, 'accept')}>Accept</button>
                <button onClick={() => updateFriendRequestStatus(request._id, 'decline')}>Decline</button>
              </div>
            </div>
          ))}
        </div>
        <div className="outgoing-requests">
          <h3>Outgoing Friend Requests</h3>
          {outgoingRequests.map(request => (
            <div key={request._id} className="request-item">
              <p>To: {request.otherUsername} - Status: {request.status}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3>Current Friends</h3>
        {friends.map(friend => (
          <div key={friend._id} className="friend">
            <p>{friend.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsPage;
