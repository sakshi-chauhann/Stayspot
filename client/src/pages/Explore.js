import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';

// Import your real PG images from src/assets/images/
import vallestayImg from '../assets/images/Vallestay.jpeg';
import cantraImg from '../assets/images/anitra.jpeg';
import solitaireImg from '../assets/images/Solitaire.jpeg';
import balajiImg from '../assets/images/Shri Balaji.jpeg';  // ← Fixed: Capital S
import newfriendsImg from '../assets/images/newfriends.jpeg';
import galaxyImg from '../assets/images/galaxy.jpeg';

const Explore = () => {
    const navigate = useNavigate();
    const [selectedGender, setSelectedGender] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 15000]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFacility, setSelectedFacility] = useState('');

    const allPGs = [
        {
            id: 1,
            name: 'Vallestay Girls Hostel',
            address: 'Shiv Vihar, Saharanpur Road, Majra, Dehradun',
            price: 8000,
            type: 'girls',
            facilities: ['Kitchen', 'Laundry', 'WiFi', 'CCTV', 'Private Bathroom'],
            rating: 4.5,
            distance: '0.8 km',
            image: vallestayImg
        },
        {
            id: 2,
            name: 'CANTRA PG',
            address: 'Near Ballupur Chowk, Rajender Nagar, Dehradun',
            price: 10000,
            type: 'boys',
            facilities: ['Kitchen', 'WiFi', 'Parking', 'CCTV', 'Laundry'],
            rating: 4.3,
            distance: '1.2 km',
            image: cantraImg
        },
        {
            id: 3,
            name: 'Solitaire PG for Girls',
            address: 'Bell Road, Subhash Nagar, Dehradun',
            price: 12000,
            type: 'girls',
            facilities: ['Mess', 'Water Purifier', 'WiFi', 'Transport', 'Security'],
            rating: 4.7,
            distance: '1.5 km',
            image: solitaireImg
        },
        {
            id: 4,
            name: 'Shri Balaji Boys Hostel',
            address: 'Bharuwala Colony, Clement Town, Dehradun',
            price: 7000,
            type: 'boys',
            facilities: ['WiFi', 'RO Water', 'Cleaning', 'Parking', 'Power Backup'],
            rating: 4.2,
            distance: '2.0 km',
            image: balajiImg
        },
        {
            id: 5,
            name: 'New Friends PG (Boys)',
            address: 'Sunshine Enclave Road, Clement Town, Dehradun',
            price: 8500,
            type: 'boys',
            facilities: ['WiFi', 'Power Backup', 'Water Purifier', 'Mess'],
            rating: 4.4,
            distance: '1.8 km',
            image: newfriendsImg
        },
        {
            id: 6,
            name: 'Galaxy Grand PG',
            address: 'Graphic Era Hill University Road, Subhash Nagar, Dehradun',
            price: 9500,
            type: 'co-ed',
            facilities: ['WiFi', 'Laundry', 'Tiffin System', 'Security'],
            rating: 4.6,
            distance: '0.5 km',
            image: galaxyImg
        }
    ];

    const getTypeLabel = (type) => {
        if (type === 'boys') return 'Boys PG';
        if (type === 'girls') return 'Girls PG';
        return 'Co-ed PG';
    };

    const getTypeColor = (type) => {
        if (type === 'boys') return '#3498db';
        if (type === 'girls') return '#e91e63';
        return '#9b59b6';
    };

    const filteredPGs = allPGs.filter(pg => {
        if (selectedGender !== 'all' && pg.type !== selectedGender) return false;
        if (pg.price < priceRange[0] || pg.price > priceRange[1]) return false;
        if (searchTerm && !pg.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (selectedFacility && !pg.facilities.includes(selectedFacility)) return false;
        return true;
    });

    const allFacilities = [...new Set(allPGs.flatMap(pg => pg.facilities))];

    return (
        <div className="explore-page">
            <div className="explore-hero">
                <h1>Find Your Perfect PG Near Graphic Era</h1>
                <p>Discover safe, comfortable, and affordable accommodations near your college</p>
            </div>

            <div className="explore-content">
                <div className="filter-sidebar">
                    <h3>Filters</h3>
                    
                    <div className="filter-group">
                        <label>Gender Type</label>
                        <div className="gender-filters">
                            <button className={`filter-btn ${selectedGender === 'all' ? 'active' : ''}`} onClick={() => setSelectedGender('all')}>All</button>
                            <button className={`filter-btn ${selectedGender === 'boys' ? 'active' : ''}`} onClick={() => setSelectedGender('boys')}>Boys</button>
                            <button className={`filter-btn ${selectedGender === 'girls' ? 'active' : ''}`} onClick={() => setSelectedGender('girls')}>Girls</button>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Max Price: ₹{priceRange[1]}</label>
                        <input 
                            type="range" 
                            min="0" 
                            max="15000" 
                            step="500" 
                            value={priceRange[1]} 
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} 
                        />
                        <div className="price-values">
                            <span>₹0</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Search PG</label>
                        <input 
                            type="text" 
                            placeholder="Enter PG name..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="search-input" 
                        />
                    </div>

                    <div className="filter-group">
                        <label>Facility</label>
                        <select 
                            value={selectedFacility} 
                            onChange={(e) => setSelectedFacility(e.target.value)} 
                            className="facility-select"
                        >
                            <option value="">All Facilities</option>
                            {allFacilities.map((fac, idx) => (
                                <option key={idx} value={fac}>{fac}</option>
                            ))}
                        </select>
                    </div>

                    <div className="results-info">
                        <strong>{filteredPGs.length}</strong> PGs found
                    </div>
                    
                    <button className="clear-filters" onClick={() => { 
                        setSelectedGender('all'); 
                        setPriceRange([0, 15000]); 
                        setSearchTerm(''); 
                        setSelectedFacility(''); 
                    }}>
                        Clear All Filters
                    </button>
                </div>

                <div className="pgs-grid">
                    {filteredPGs.length === 0 ? (
                        <div className="no-results">
                            <p>No PGs found matching your criteria.</p>
                            <button onClick={() => { 
                                setSelectedGender('all'); 
                                setPriceRange([0, 15000]); 
                                setSearchTerm(''); 
                                setSelectedFacility(''); 
                            }}>Clear Filters</button>
                        </div>
                    ) : (
                        filteredPGs.map(pg => (
                            <div key={pg.id} className="pg-card" onClick={() => navigate(`/pg/${pg.id}`)}>
                                <div className="pg-card-image">
                                    <img 
                                        src={pg.image} 
                                        alt={pg.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.style.background = `linear-gradient(135deg, ${getTypeColor(pg.type)}, #6B5FD6)`;
                                        }}
                                    />
                                    <span className="pg-type-badge" style={{ background: getTypeColor(pg.type) }}>
                                        {getTypeLabel(pg.type)}
                                    </span>
                                    <button className="favorite-icon" onClick={(e) => { 
                                        e.stopPropagation(); 
                                        alert('Login to add to favorites!'); 
                                    }}>♡</button>
                                </div>
                                <div className="pg-card-content">
                                    <h3>{pg.name}</h3>
                                    <p className="pg-address">{pg.address}</p>
                                    <div className="pg-price">₹{pg.price}<span>/month</span></div>
                                    <div className="pg-details-row">
                                        <span className="pg-distance">📍 {pg.distance}</span>
                                        <span className="pg-rating">⭐ {pg.rating}</span>
                                    </div>
                                    <div className="pg-facilities">
                                        {pg.facilities.slice(0, 3).map((facility, idx) => (
                                            <span key={idx} className="facility-tag">{facility}</span>
                                        ))}
                                        {pg.facilities.length > 3 && (
                                            <span className="facility-tag">+{pg.facilities.length - 3}</span>
                                        )}
                                    </div>
                                    <button className="view-details-btn">View Details →</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explore;