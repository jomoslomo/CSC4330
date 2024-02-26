import React, { useEffect } from 'react';

const LogoutPage = () => {
    useEffect(() => {
        localStorage.clear();
    }, []);

    return (
        <div>
            <h2>Logged Out Successfully</h2>
            <p>You have been logged out.</p>
            {/* add any additional content or styling for the logout page */}
        </div>
    );
};

export default LogoutPage;