import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        role: 'student',
        year: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name || !formData.age || !formData.email || !formData.password) {
            setError('Please fill all required fields');
            return;
        }
        
        try {
            const userData = {
                name: formData.name,
                age: parseInt(formData.age),
                phone: formData.phone || 'Not provided',
                email: formData.email,
                password: formData.password,
                role: formData.role
            };
            
            // Add student-specific fields
            if (formData.role === 'student') {
                userData.year = formData.year;
                userData.course = 'General';
                userData.location = 'Dehradun';
            }
            
            const response = await API.post('/auth/signup', userData);
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-header">
                    <h2>Create Account</h2>
                    <p>Join StaySpot to find your perfect stay</p>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="signup-form">
                    {/* Role Selection */}
                    <div className="role-selector">
                        <button 
                            type="button"
                            className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, role: 'student'})}
                        >
                            🧑‍🎓 Student
                        </button>
                        <button 
                            type="button"
                            className={`role-btn ${formData.role === 'owner' ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, role: 'owner'})}
                        >
                            🏠 Owner
                        </button>
                    </div>
                    
                    {/* Common Fields for Both */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    
                    <input
                        type="number"
                        name="age"
                        placeholder="Age *"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                    
                    {/* Student Only - Current Year */}
                    {formData.role === 'student' && (
                        <select 
                            name="year" 
                            value={formData.year} 
                            onChange={handleChange} 
                            required
                            className="year-select"
                        >
                            <option value="">Current Year *</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    )}
                    
                    {/* Email and Password */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    
                    <input
                        type="password"
                        name="password"
                        placeholder="Password *"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number (Optional)"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    
                    <button type="submit" className="submit-btn">
                        Create Account
                    </button>
                </form>
                
                <div className="signup-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;