import React, { useState } from 'react';

function PasswordReset() {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, newPassword }),
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Password reset successful', data);
                setMessage('Password reset successful');
            } else {
                console.log('Password reset failed', data.message);
                setMessage(data.message || 'An error occurred during password reset');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            setMessage('Failed to reset password');
        }
    };

    return (
        <div className="passwordReset">
            <form onSubmit={handleSubmit}>
                <h2>Password Reset</h2>
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
                    <label>New Password:</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Reset Password</button>
                {message && <div className="message">{message}</div>} {/* Display messages to the user */}
            </form>
        </div>
    );
}

export default PasswordReset;
