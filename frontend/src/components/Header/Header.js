import React from 'react';
import './Header.css'; // Assume you have some basic CSS in Header.css
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="appHeader">
            <h1>Building Dreams</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/build">Build Wizard</Link></li>
                    {/* Add more navigation links as needed */}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
