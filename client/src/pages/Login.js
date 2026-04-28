import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Check if user exists in localStorage
            let userData = null;
            
            // Search for user in localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('user_')) {
                    const storedUser = JSON.parse(localStorage.getItem(key));
                    if (storedUser.username === username || storedUser.name === username) {
                        userData = storedUser;
                        break;
                    }
                }
            }
            
            if (userData && password) {
                // Create mock token
                const mockToken = 'mock-token-' + Date.now();
                
                // Call login - this updates navbar immediately
                login(mockToken, userData);
                
                // Navigate based on role
                if (userData.role === 'owner') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your PG Finder account</p>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Sign In</button>
                </form>
                
                <div className="login-footer">
                    Don't have an account? <Link to="/register">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;