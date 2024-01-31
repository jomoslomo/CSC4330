// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import BuildWizard from './pages/BuildWizard/BuildWizard';
import Header from './components/Header/Header'; // If you have a Header component

function App() {
  return (
    <Router>
      <Header /> {/* If you have a Header component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build" element={<BuildWizard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
