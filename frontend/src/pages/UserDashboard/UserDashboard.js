import React, { useEffect, useState } from 'react';
import './UserDashboard.css';

function UserDashboard() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token'); // Retrieve the stored token
            try {
                const response = await fetch('http://localhost:3001/user-info', { // Adjust URL as needed
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else { 
                    console.error('Failed to fetch user info');
                    // Handle failure (e.g., redirect to login page or display an error)
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []); // Empty dependency array means this effect runs once on component mount

    return (
        <div className="dashboard-container">
            <h2>User Dashboard</h2>
            {userInfo ? (
                <>
                    <p>Welcome to your dashboard, {userInfo.username}!</p>
                    {/* Display more user info here */}
                </>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
}

export default UserDashboard;
