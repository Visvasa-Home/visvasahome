import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Grid3X3, Settings } from 'lucide-react';
import Bookings from './pages/Bookings';
import Services from './pages/Services';

function Sidebar() {
  return (
    <div className="sidebar">
      <h1>Visvasa Admin</h1>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/bookings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <CalendarDays size={20} /> Bookings
        </NavLink>
        <NavLink to="/services" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Grid3X3 size={20} /> Services
        </NavLink>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="page-header">
      <h2>Welcome back, Admin</h2>
      <p>Here's what's happening with Visvasa Home today.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
