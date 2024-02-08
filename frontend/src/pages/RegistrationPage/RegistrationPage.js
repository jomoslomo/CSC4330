// src/pages/RegistrationPage/RegistrationPage.js
import React, { useState } from 'react';
import './RegistrationPage.css';

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('User registered successfully');
            } else {
                setMessage(data.message || 'An error occurred');
            }
        } catch (error) {
            setMessage('Failed to register');
        }
    };

    return (
        <div className="registration-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
                <div className="message">{message}</div>
            </form>
        </div>
    );
}

export default RegistrationPage;
