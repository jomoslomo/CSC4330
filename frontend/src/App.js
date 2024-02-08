// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import BuildWizard from './pages/BuildWizard/BuildWizard';
import Header from './components/Header/Header'; // If you have a Header component
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
function App() {
  return (
    <Router>
      <Header /> {/* If you have a Header component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build" element={<BuildWizard />} />
        <Route path="/login" element={<LoginPage />} /> {/* Add the login route */}
        <Route path="/register" element={<RegistrationPage />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
