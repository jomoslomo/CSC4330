// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import BuildWizard from './pages/BuildWizard/BuildWizard';
import Header from './components/Header/Header'; // If you have a Header component
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import MessagesPage from './pages/MessagesPage/MessagesPage'; // Import the MessagesPage component
import ConversationsPage from './pages/MessagesPage/ConversationsPage'; // Import the ConversationsPage component
// Inside your Router and Routes component:
//import LogoutPage from './pages/LogoutPage/Logout'; 

const AuthWrapper = () => {
  const location = useLocation(); // current location

  const userLogged = JSON.parse(localStorage.getItem("userLogged"));

  return userLogged
    ? <Outlet />
    : (
      <Navigate
        to="/"
        replace
        state={{ from: location }} // <-- pass location in route state
      />
    );
};


function App() {
  return (
    <Router>
      <Header /> {/* If you have a Header component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build" element={<BuildWizard />} />
        <Route path="/login" element={<LoginPage />} /> {/* Add the login route */}
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
