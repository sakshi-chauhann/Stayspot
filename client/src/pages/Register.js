import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

const Register = () => {
    const [role, setRole] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        age: '',
        year: '',
        password: '',
        name: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!role) {
            setError('Please select whether you are a Student or Owner');
            return;
        }
        
        try {
            let userData;
            
            if (role === 'student') {
                if (!formData.username || !formData.age || !formData.year || !formData.password) {
                    setError('Please fill all required fields');
                    return;
                }
                
                // Create student user object
                userData = {
                    id: Date.now().toString(),
                    name: formData.username,
                    username: formData.username,
                    age: parseInt(formData.age),
                    year: formData.year,
                    role: 'student',
                    email: `${formData.username}@pgfinder.com`,
                    phone: formData.phone || 'Not provided',
                    profilePhoto: null,
                    createdAt: new Date().toISOString()
                };
            } else {
                if (!formData.name || !formData.phone || !formData.password) {
                    setError('Please fill all required fields');
                    return;
                }
                
                // Create owner user object
                userData = {
                    id: Date.now().toString(),
                    name: formData.name,
                    username: formData.name,
                    phone: formData.phone,
                    role: 'owner',
                    email: `${formData.phone}@pgfinder.com`,
                    age: 0,
                    profilePhoto: null,
                    createdAt: new Date().toISOString()
                };
            }
            
            // Create a mock token
            const mockToken = 'mock-token-' + Date.now();
            
            // Store user data in localStorage for persistence
            localStorage.setItem(`user_${userData.id}`, JSON.stringify(userData));
            
            // Show success message
            setSuccess('Account created successfully! Logging you in...');
            
            // IMPORTANT: Call login immediately - this updates the navbar instantly
            setTimeout(() => {
                login(mockToken, userData);
                
                // Navigate based on role
                if (role === 'owner') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            }, 1000);
            
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    if (!role) {
        return (
            <div className="register-page">
                <div className="role-selection-card">
                    <h2>Join PG Finder</h2>
                    <p>Choose how you want to use our platform</p>
                    <div className="role-options">
                        <div onClick={() => setRole('student')} className="role-option student">
                            <div className="role-icon">🧑‍🎓</div>
                            <h3>Register as Student</h3>
                            <p>Find PGs, book rooms, pay rent</p>
                        </div>
                        <div onClick={() => setRole('owner')} className="role-option owner">
                            <div className="role-icon">🏠</div>
                            <h3>Register as Owner</h3>
                            <p>List your PG, manage tenants</p>
                        </div>
                    </div>
                    <div className="login-link">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <button className="back-button" onClick={() => setRole(null)}>← Back</button>
                <h2>{role === 'student' ? 'Student Registration' : 'Owner Registration'}</h2>
                <p className="subtitle">Create your account to get started</p>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form onSubmit={handleSubmit} className="register-form">
                    {role === 'student' ? (
                        <>
                            <div className="input-group">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Age *</label>
                                <input
                                    type="number"
                                    name="age"
                                    placeholder="Your age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Current Year *</label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select your current year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="input-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Contact number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}
                    
                    <button type="submit" className="submit-btn">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;