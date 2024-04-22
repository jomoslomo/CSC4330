import React, { useState, useEffect } from 'react';
import './ShareBuildsPage.css';

function BuildSelector({ builds, selectedBuildId, onBuildSelect }) {
  return (
    <select value={selectedBuildId} onChange={e => onBuildSelect(e.target.value)} className="dropdown">
      <option value="">Select a Build</option>
      {builds.map((build) => (
        <option key={build._id} value={build._id}>
          {build.build_name}
        </option>
      ))}
    </select>
  );
}

function FriendSelector({ friends, selectedFriendId, onFriendSelect }) {
  return (
    <select value={selectedFriendId} onChange={e => onFriendSelect(e.target.value)} className="dropdown">
      <option value="">Select a Friend</option>
      {friends.map((friend) => (
        <option key={friend._id} value={friend._id}>
          {friend.username}
        </option>
      ))}
    </select>
  );
}

function ShareBuildsPage() {
  const [builds, setBuilds] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedBuildId, setSelectedBuildId] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetchData('user/builds', setBuilds, token),
      fetchData('friends/list', setFriends, token)
    ]).catch(console.error);
  }, []);

  const fetchData = async (endpoint, setter, token) => {
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

  const shareBuild = async (e) => {
    e.preventDefault();
    if (!selectedBuildId || !selectedFriendId) {
      setFeedback('Please select both a build and a friend to share with.');
      return;
    }
    const token = localStorage.getItem('token');
    const payload = {
      buildId: selectedBuildId,
      recipientUsername: friends.find(friend => friend._id === selectedFriendId)?.username,
    };

    const response = await fetch('http://localhost:3001/user/builds/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setFeedback('Build shared successfully.');
    } else {
      const errorData = await response.text();  // or response.json() if the response is in JSON format
      console.error('Failed to share build', errorData);
      setFeedback(`Failed to share build: ${errorData}. Please try again.`);
    }
  };

  return (
    <div className="shareBuildsPageContainer">
      <div className="buildSelectorContainer">
        <BuildSelector builds={builds} selectedBuildId={selectedBuildId} onBuildSelect={setSelectedBuildId} />
      </div>
      <div className="recipientSelectorContainer">
        <FriendSelector friends={friends} selectedFriendId={selectedFriendId} onFriendSelect={setSelectedFriendId} />
      </div>
      <div className="feedback">{feedback}</div>
      <form onSubmit={shareBuild}>
        <button type="submit">Share Build</button>
      </form>
    </div>
  );
}

export default ShareBuildsPage;
