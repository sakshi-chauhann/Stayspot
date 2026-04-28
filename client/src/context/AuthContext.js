import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Set up axios default headers
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    }

    useEffect(() => {
        // Check if user is logged in on page load
        const checkLoggedIn = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                axios.defaults.headers.common['x-auth-token'] = storedToken;
            }
            setLoading(false);
        };
        
        checkLoggedIn();
    }, []);

    // Login function - updates immediately
    const login = (newToken, userData) => {
        console.log('Login called with:', { newToken, userData });
        
        // Store in localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set axios header
        axios.defaults.headers.common['x-auth-token'] = newToken;
        
        // Update state - this triggers navbar re-render immediately
        setToken(newToken);
        setUser(userData);
        
        console.log('User logged in:', userData);
    };

    // Logout function - updates immediately
    const logout = () => {
        console.log('Logout called');
        
        // Remove from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Remove axios header
        delete axios.defaults.headers.common['x-auth-token'];
        
        // Update state - this triggers navbar re-render immediately
        setToken(null);
        setUser(null);
        
        console.log('User logged out');
    };

    // Update user profile
    const updateUser = (updatedUser) => {
        const newUserData = { ...user, ...updatedUser };
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    const value = {
        user,
        token,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;