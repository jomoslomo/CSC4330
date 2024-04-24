import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate(); // Initialize navigate
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Login successful', data);
                setMessage('Login successful');
                localStorage.setItem('token', data.token); // Save the token
                localStorage.setItem('userId', data.userId); // Assuming 'userId' is part of the response
                localStorage.setItem('username', username); // Save the username for later use
                window.dispatchEvent(new CustomEvent('login', { detail: data }));
                navigate('/dashboard'); // Redirect to the dashboard
            }
            else {
                console.log('Login failed', data.message);
                setMessage(data.message || 'An error occurred during login');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Failed to login');
        }
    };

    return (
        <div className="loginPage">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="formGroup">
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="formGroup">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Login</button>
                {message && <div className="message">{message}</div>} {/* Display messages to the user */}
            </form>
        </div>
    );
}

export default LoginPage;


