import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // ← NEW: For mobile hamburger menu

    const handleLogout = () => {
        logout();
        navigate('/');
        setDropdownOpen(false);
        setIsMenuOpen(false);
    };

    // Close menu when clicking a link
    const closeMenu = () => {
        setIsMenuOpen(false);
        setDropdownOpen(false);
    };

    // Debug logging
    console.log('Navbar - Current user:', user);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <span className="logo-icon">🏠</span>
                    <span className="logo-text">StaySpot</span>
                </Link>
                
                {/* Hamburger Menu Button - Shows on mobile */}
                <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    ☰
                </button>
                
                {/* Navigation Menu - Add 'open' class when menu is open */}
                <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                    <li><Link to="/explore" onClick={closeMenu}>Explore PGs</Link></li>
                    
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
                                        <Link to="/profile" onClick={closeMenu}>
                                            👤 My Profile
                                        </Link>
                                        {user.role === 'owner' && (
                                            <Link to="/dashboard" onClick={closeMenu}>
                                                📊 Dashboard
                                            </Link>
                                        )}
                                        <Link to="/my-bookings" onClick={closeMenu}>
                                            📅 My Bookings
                                        </Link>
                                        <Link to="/favorites" onClick={closeMenu}>
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
                            <li><Link to="/login" className="login-btn" onClick={closeMenu}>Sign In</Link></li>
                            <li><Link to="/register" className="register-btn" onClick={closeMenu}>Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;