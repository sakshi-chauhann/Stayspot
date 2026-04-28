import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="dashboard">
            <h1>Welcome, {user?.name}!</h1>
            <div className="dashboard-info">
                <h3>Your Profile</h3>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                {user?.role === 'student' && (
                    <>
                        <p><strong>Course:</strong> {user?.course}</p>
                        <p><strong>Year:</strong> {user?.year}</p>
                        <p><strong>Location:</strong> {user?.location}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;