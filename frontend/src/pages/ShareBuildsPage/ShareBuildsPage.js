import React, { useState, useEffect } from 'react';
import './ShareBuildsPage.css';

function RecipientSelector({ friends, selectedUserId, onUserSelect }) {
  if (!friends.length) {
    return <p>No friends to display. Add some friends to share builds!</p>;
  }
  return (
    <select value={selectedUserId} onChange={e => onUserSelect(e.target.value)} className="dropdown">
      <option value="">Select a friend</option>
      {friends.map(friend => (
        <option key={friend._id} value={friend._id}>{friend.username}</option>
      ))}
    </select>
  );
}

function BuildSelector({ builds, selectedBuildId, onBuildSelect }) {
  if (!builds.length) {
    return <p>No builds to display. Start by creating some builds!</p>;
  }
  return (
    <select value={selectedBuildId} onChange={e => onBuildSelect(e.target.value)} className="dropdown">
      <option value="">Select a build</option>
      {builds.map(build => (
        <option key={build._id} value={build._id}>{build.build_name}</option>
      ))}
    </select>
  );
}

function SharedBuilds({ builds }) {
  if (!builds.length) {
    return <p>No builds have been shared with you.</p>;
  }

  return (
    <div>
      <h2>Builds Shared With You</h2>
      {builds.map(build => (
        <div key={build._id} className="sharedBuild">
          <h3>{build.build_name}</h3>
          <p>Components: {build.components.map(component => component.name).join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

function ShareBuildsPage() {
  const [builds, setBuilds] = useState([]);
  const [sharedBuilds, setSharedBuilds] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedBuildId, setSelectedBuildId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchResources = async () => {
      const headers = { headers: { 'Authorization': `Bearer ${token}` }};
      const urls = [
        fetch('http://localhost:3001/user/builds', headers),
        fetch('http://localhost:3001/friends/list', headers),
        fetch('http://localhost:3001/received-builds', headers)
      ];

      try {
        const responses = await Promise.all(urls.map(url => url.then(res => res.ok ? res.json() : [])));
        setBuilds(responses[0]);
        setFriends(responses[1]);
        setSharedBuilds(responses[2]);
      } catch (error) {
        console.error('Fetch error:', error);
        setFeedback('Failed to load resources. Please try again later.');
      }
    };

    fetchResources();
  }, []);

  const shareBuild = async () => {
    if (!selectedBuildId || !selectedUserId) {
      setFeedback('Please select a build and a friend to share with.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3001/share-build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          buildId: selectedBuildId,
          recipientUsername: friends.find(friend => friend._id === selectedUserId)?.username
        })
      });

      if (response.ok) {
        setFeedback('Build shared successfully!');
        setSelectedBuildId('');
        setSelectedUserId('');
      } else {
        throw new Error('Failed to share build');
      }
    } catch (error) {
      console.error('Error sharing build:', error);
      setFeedback(`Error sharing build: ${error.message}`);
    }
  };

  return (
    <div className="shareBuildsPageContainer">
      <h1>Share Your Build</h1>
      <div className="selectors">
        <BuildSelector builds={builds} selectedBuildId={selectedBuildId} onBuildSelect={setSelectedBuildId} />
        <RecipientSelector friends={friends} selectedUserId={selectedUserId} onUserSelect={setSelectedUserId} />
      </div>
      {feedback && <div className="feedback">{feedback}</div>}
      <button onClick={shareBuild} disabled={!selectedBuildId || !selectedUserId}>Share Build</button>
      <SharedBuilds builds={sharedBuilds} />
    </div>
  );
}

export default ShareBuildsPage;
