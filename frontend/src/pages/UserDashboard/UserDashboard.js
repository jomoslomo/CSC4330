import React, { useEffect, useState } from 'react';
import './UserDashboard.css';

function UserDashboard() {
    const [userInfo, setUserInfo] = useState(null);
    const [userBuilds, setUserBuilds] = useState([]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3001/user-info', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                    fetchUserBuilds(token);
                } else { 
                    console.error('Failed to fetch user info');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        const fetchUserBuilds = async (token) => {
            try {
                const buildsResponse = await fetch('http://localhost:3001/user/builds', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (buildsResponse.ok) {
                    const buildsData = await buildsResponse.json();
                    setUserBuilds(buildsData);
                } else {
                    console.error('Failed to fetch user builds');
                }
            } catch (error) {
                console.error('Error fetching user builds:', error);
            }
        };

        fetchUserInfo();
    }, []);

    // Conditional rendering logic
    if (!userInfo) {
        return <p>Loading user information...</p>;
    }

    return (
        <div className="dashboard-container">
            <h2>User Dashboard</h2>
            <p>Welcome to your dashboard, {userInfo.username}!</p>
            <h3>Your Builds</h3>
            {userBuilds.length ? (
                <div className="builds-container">
                    {userBuilds.map((build) => (
                        <div key={build.id} className="build-box">
                            <h4>{build.build_name}</h4>
                            <p>Components:</p>
                            <ul>
                                {build.components.map((component, index) => (
                                    <li key={index}>{component && component.name}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no builds.</p>
            )}
        </div>
    );
}

export default UserDashboard;
