import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setDropdownOpen(false);
    };

    // Debug logging
    console.log('Navbar - Current user:', user);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🏠</span>
                    <span className="logo-text">StaySpot</span>
                </Link>
                
                <ul className="nav-menu">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/explore">Explore PGs</Link></li>
                    
                    {user ? (
                        <>
                            {/* Profile Icon with Dropdown - Shows when user is logged in */}
                            <li className="profile-dropdown">
                                <div 
                                    className="profile-icon-container" 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <div className="profile-icon">
                                        {user.profilePhoto ? (
                                            <img src={user.profilePhoto} alt="profile" />
                                        ) : (
                                            <span>{user.name?.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                                
                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <div className="dropdown-avatar">
                                                {user.profilePhoto ? (
                                                    <img src={user.profilePhoto} alt="profile" />
                                                ) : (
                                                    <span>{user.name?.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="dropdown-info">
                                                <h4>{user.name}</h4>
                                                <p>{user.role === 'student' ? 'Student' : 'PG Owner'}</p>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                                            👤 My Profile
                                        </Link>
                                        {user.role === 'owner' && (
                                            <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                                                📊 Dashboard
                                            </Link>
                                        )}
                                        <Link to="/my-bookings" onClick={() => setDropdownOpen(false)}>
                                            📅 My Bookings
                                        </Link>
                                        <Link to="/favorites" onClick={() => setDropdownOpen(false)}>
                                            ❤️ Saved PGs
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button onClick={handleLogout} className="dropdown-logout">
                                            🚪 Sign Out
                                        </button>
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <>
                            {/* Show Sign In and Register buttons when NOT logged in */}
                            <li><Link to="/login" className="login-btn">Sign In</Link></li>
                            <li><Link to="/register" className="register-btn">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;