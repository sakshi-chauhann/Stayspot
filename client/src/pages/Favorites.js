import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import './Favorites.css';

const Favorites = () => {
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const response = await API.get('/favorites');
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const removeFavorite = async (pgId) => {
        try {
            await API.delete(`/favorites/${pgId}`);
            fetchFavorites();
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    if (!user) {
        return <div className="favorites-container">Please login to view favorites</div>;
    }

    return (
        <div className="favorites-container">
            <h1>Your Favorite PGs</h1>
            {favorites.length === 0 ? (
                <p>No favorites yet. Start exploring and save your favorite PGs!</p>
            ) : (
                <div className="favorites-grid">
                    {favorites.map((fav) => (
                        <div key={fav._id} className="favorite-card">
                            <h3>{fav.pgId?.name}</h3>
                            <p>{fav.pgId?.address}</p>
                            <p>₹{fav.pgId?.price}/month</p>
                            <button onClick={() => removeFavorite(fav.pgId?._id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;