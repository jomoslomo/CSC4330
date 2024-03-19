import React, { useEffect, useState } from 'react';
import './Header.css'; // Assume you have some basic CSS in Header.css
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Handle case where there is no token (user not logged in)
                return;
            }
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
                    // Optionally, clear localStorage or navigate to login
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                // Handle error (e.g., show error message or navigate to login)
            }
        };

        // Call fetchUserInfo on component mount
        fetchUserInfo();

        // Define event listener for login event
        const handleLoginEvent = () => fetchUserInfo();

        // Add event listener for login
        window.addEventListener('login', handleLoginEvent);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('login', handleLoginEvent);
        };
    }, []); // Dependency array is empty, so effect runs once on component mount and cleanup runs on unmount

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.clear(); // Clear user session
        setUserInfo(null); // Reset user info state
        navigate('/login'); // Navigate to login page
    };
    // Add this function to handle redirection to the dashboard
    const redirectToDashboard = () => {
        navigate('/dashboard');
    };
    return (
<header className="appHeader">
    <h1>Building Dreams</h1>
    <div className="headerContent">
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/build">Build Wizard</Link></li>
                {/* Other navigation links */}
            </ul>
        </nav>
        {userInfo ? (
            <div className="authLinks userDashboard">
                <span onClick={redirectToDashboard} style={{cursor: 'pointer'}}>Welcome, {userInfo.username}!</span>
                <Link to="/logout" onClick={handleLogout}>Logout</Link>
                <Link to="/messages">Messages</Link>
            </div>
        ) : (
            <div className="authLinks">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        )}
    </div>
</header>

    );
    
    
}

export default Header;
