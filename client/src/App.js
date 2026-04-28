import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import PGDetails from './pages/PGDetails';
import BookingPayment from './pages/BookingPayment';
import BookingForm from './pages/BookingForm';
import StudentProfile from './pages/StudentProfile';
import OwnerDashboard from './pages/OwnerDashboard';
import Bookings from './pages/Bookings';
import AddPG from './pages/AddPG';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/pg/:id" element={<PGDetails />} />
                    <Route path="/booking/:id" element={<BookingPayment />} />
                    <Route path="/booking-form" element={<BookingForm />} />
                    <Route path="/booking-payment" element={<BookingPayment />} />
                    <Route path="/profile" element={<StudentProfile />} />
                    <Route path="/dashboard" element={<OwnerDashboard />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/add-pg" element={<AddPG />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;