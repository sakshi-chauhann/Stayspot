import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './StudentProfile.css';

const StudentProfile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: '',
        username: '',
        age: '',
        phone: '',
        email: '',
        year: '',
        course: '',
        location: '',
        bio: '',
        profilePhoto: ''
    });
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPhotoUpload, setShowPhotoUpload] = useState(false);

    useEffect(() => {
        if (user) {
            // Load saved profile from localStorage or use user data
            const savedProfile = localStorage.getItem(`student_profile_${user.id}`);
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            } else {
                // Use registration data
                setProfile({
                    name: user.name || '',
                    username: user.username || user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    age: user.age || '',
                    year: user.year || '',
                    course: user.course || '',
                    location: user.location || 'Dehradun',
                    bio: user.bio || 'Student at Graphic Era Hill University',
                    profilePhoto: user.profilePhoto || ''
                });
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newProfile = { ...profile, profilePhoto: reader.result };
                setProfile(newProfile);
                // Save to localStorage
                localStorage.setItem(`student_profile_${user.id}`, JSON.stringify(newProfile));
                setShowPhotoUpload(false);
                setMessage('Profile photo updated!');
                setTimeout(() => setMessage(''), 2000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        try {
            // Validate required fields
            if (!profile.name || !profile.username) {
                setError('Name and username are required');
                return;
            }
            
            // Save to localStorage
            localStorage.setItem(`student_profile_${user.id}`, JSON.stringify(profile));
            
            // Update user context
            if (updateUser) {
                updateUser({ ...user, ...profile });
            }
            
            setMessage('Profile updated successfully!');
            setEditing(false);
            
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to update profile. Please try again.');
        }
    };

    if (!user) {
        return (
            <div className="profile-container">
                <div className="error-card">
                    <h2>Please Login</h2>
                    <p>You need to be logged in to view your profile</p>
                    <Link to="/login" className="login-link">Sign In</Link>
                </div>
            </div>
        );
    }

    // Check if user is student
    if (user.role !== 'student') {
        return (
            <div className="profile-container">
                <div className="error-card">
                    <h2>Access Denied</h2>
                    <p>This page is only for students.</p>
                    <button onClick={() => navigate('/dashboard')} className="login-link">
                        Go to Owner Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="student-profile">
            <div className="profile-header-banner">
                <h1>My Profile</h1>
                <p>Manage your account, bookings, and payments</p>
            </div>
            
            <div className="profile-content">
                <div className="profile-card">
                    {/* Profile Avatar Section */}
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large" style={{ cursor: editing ? 'pointer' : 'default' }} onClick={() => editing && setShowPhotoUpload(true)}>
                            {profile.profilePhoto ? (
                                <img src={profile.profilePhoto} alt="Profile" />
                            ) : (
                                <span>{profile.name?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase()}</span>
                            )}
                            {editing && (
                                <button className="upload-photo-btn" onClick={() => setShowPhotoUpload(true)}>
                                    📷
                                </button>
                            )}
                        </div>
                        <div className="profile-name-info">
                            <h2>{profile.name || user.name}</h2>
                            <p className="profile-username">@{profile.username || user.username}</p>
                            <p className="profile-role">🎓 Student at Graphic Era Hill University</p>
                            {!editing && (
                                <button onClick={() => setEditing(true)} className="edit-profile-btn">
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Add this section after the profile-card closing tag */}

                <div className="profile-nav-buttons" style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    marginTop: '2rem'
                }}>
                <button 
                   onClick={() => navigate('/bookings')}
                   style={{
                   padding: '0.8rem 1.5rem',
                   background: '#534AB7',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
        }}
    >
        📋 View My Bookings
    </button>
    <button 
        onClick={() => navigate('/liked-pgs')}
        style={{
            padding: '0.8rem 1.5rem',
            background: '#48bb78',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
        }}
    >
        ❤️ Liked PGs
    </button>
</div>
                    {/* Messages */}
                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}
                    
                    {/* Photo Upload Modal */}
                    {showPhotoUpload && (
                        <div className="photo-upload-modal" onClick={() => setShowPhotoUpload(false)}>
                            <div className="photo-upload-content" onClick={(e) => e.stopPropagation()}>
                                <h3>Upload Profile Photo</h3>
                                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                                <button onClick={() => setShowPhotoUpload(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                    
                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-section">
                            <h3>Personal Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Username *</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={profile.username || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Your username"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={profile.age || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Your age"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Your phone number"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email || ''}
                                    disabled
                                    className="disabled-input"
                                />
                                <small className="field-hint">Email cannot be changed</small>
                            </div>
                            
                            <div className="form-group">
                                <label>Bio</label>
                                <textarea
                                    name="bio"
                                    rows="3"
                                    value={profile.bio || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                        
                        <div className="form-section">
                            <h3>Academic Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Current Year</label>
                                    <select
                                        name="year"
                                        value={profile.year || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Course</label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={profile.course || ''}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="e.g., B.Tech Computer Science"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={profile.location || ''}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="e.g., Dehradun"
                                />
                            </div>
                        </div>
                        
                        {editing && (
                            <div className="form-actions">
                                <button type="submit" className="save-btn">Save Changes</button>
                                <button type="button" onClick={() => {
                                    setEditing(false);
                                    setError('');
                                    // Reload saved data
                                    const savedProfile = localStorage.getItem(`student_profile_${user.id}`);
                                    if (savedProfile) {
                                        setProfile(JSON.parse(savedProfile));
                                    }
                                }} className="cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;