import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import './Explore.css';



// Sample PG Images (using Unsplash/Pexels free images)

// You can replace these with your own images

const pgImages = {

    vallestay: 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?w=400&h=300&fit=crop',

    cantra: 'https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?w=400&h=300&fit=crop',

    solitaire: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?w=400&h=300&fit=crop',

    balaji: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?w=400&h=300&fit=crop',

    newfriends: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=400&h=300&fit=crop',

    galaxy: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?w=400&h=300&fit=crop',

};



const Explore = () => {

    const navigate = useNavigate();

    const [selectedGender, setSelectedGender] = useState('all');

    const [priceRange, setPriceRange] = useState([0, 15000]);

    const [searchTerm, setSearchTerm] = useState('');

    const [selectedFacility, setSelectedFacility] = useState('');



    // Complete PG Data with Images

    const allPGs = [

        {

            id: 1,

            name: 'Vallestay Girls Hostel',

            address: 'Shiv Vihar, Saharanpur Road, Majra, Dehradun',

            fullAddress: 'Shiv Vihar, Saharanpur Road, Majra, Dehradun, Uttarakhand 248171',

            price: 8000,

            type: 'girls',

            facilities: ['Kitchen', 'Laundry Service', 'Private Bathroom', 'WiFi', 'Balcony', 'Fire Safety', 'CCTV Surveillance'],

            images: [pgImages.vallestay, '🏠', '🛏️'],

            rating: 4.5,

            distance: '0.8 km',

            contact: '+91 9876543210',

            owner: 'Mrs. Sharma',

            image: pgImages.vallestay,

            roomTypes: [

                { type: 'Single Room', price: 12000, available: 2 },

                { type: 'Double Sharing', price: 8000, available: 5 },

                { type: 'Triple Sharing', price: 6000, available: 3 }

            ]

        },

        {

            id: 2,

            name: 'CANTRA PG',

            address: 'Near Ballupur Chowk, Rajender Nagar, Dehradun',

            fullAddress: 'House No. 359/1, Street No. 11, Near Ballupur Chowk, Rajender Nagar, Dehradun',

            price: 10000,

            type: 'boys',

            facilities: ['Kitchen', 'Laundry Service', 'Private Bathroom', 'WiFi', 'Parking', 'CCTV'],

            images: [pgImages.cantra, '🏠', '🛏️'],

            rating: 4.3,

            distance: '1.2 km',

            contact: '+91 9876543211',

            owner: 'Mr. Verma',

            image: pgImages.cantra,

            roomTypes: [

                { type: 'Single Room', price: 12000, available: 1 },

                { type: 'Double Sharing', price: 10000, available: 4 },

                { type: 'Triple Sharing', price: 8000, available: 2 }

            ]

        },

        {

            id: 3,

            name: 'Solitaire PG for Girls',

            address: 'Bell Road, Subhash Nagar, Dehradun',

            fullAddress: '154/2-1, Bell Road, Society Area, Subhash Nagar, Dehradun',

            price: 12000,

            type: 'girls',

            facilities: ['Mess Available', 'Water Purifier', 'Transport Facility', 'WiFi', 'Housing Staff'],

            images: [pgImages.solitaire, '🏠', '🍽️'],

            rating: 4.7,

            distance: '1.5 km',

            contact: '+91 9876543212',

            owner: 'Mrs. Gupta',

            image: pgImages.solitaire,

            roomTypes: [

                { type: 'Single Room', price: 15000, available: 3 },

                { type: 'Double Sharing', price: 12000, available: 6 },

                { type: 'Triple Sharing', price: 10000, available: 4 }

            ]

        },

        {

            id: 4,

            name: 'Shri Balaji Boys Hostel',

            address: 'Bharuwala Colony, Clement Town, Dehradun',

            fullAddress: 'Lane No. 11, Bharuwala Colony, Clement Town, Dehradun',

            price: 7000,

            type: 'boys',

            facilities: ['Free WiFi', 'RO Water', 'Daily Cleaning', 'Parking', 'Fire Extinguisher', 'Power Backup'],

            images: [pgImages.balaji, '🏠', '💧'],

            rating: 4.2,

            distance: '2.0 km',

            contact: '+91 9876543213',

            owner: 'Mr. Singh',

            image: pgImages.balaji,

            roomTypes: [

                { type: 'Single Room', price: 9000, available: 4 },

                { type: 'Double Sharing', price: 7000, available: 8 },

                { type: 'Triple Sharing', price: 5500, available: 6 }

            ]

        },

        {

            id: 5,

            name: 'New Friends PG (Boys)',

            address: 'Sunshine Enclave Road, Clement Town, Dehradun',

            fullAddress: 'Sunshine Enclave Road, Clement Town, Dehradun',

            price: 8500,

            type: 'boys',

            facilities: ['WiFi', '24/7 Power Backup', 'Water Purifier', 'Mess Available'],

            images: [pgImages.newfriends, '🏠', '⚡'],

            rating: 4.4,

            distance: '1.8 km',

            contact: '+91 9876543214',

            owner: 'Mr. Kumar',

            image: pgImages.newfriends,

            roomTypes: [

                { type: 'Single Room', price: 10000, available: 2 },

                { type: 'Double Sharing', price: 8500, available: 5 },

                { type: 'Triple Sharing', price: 7000, available: 3 }

            ]

        },

        {

            id: 6,

            name: 'Galaxy Grand PG',

            address: 'Graphic Era Hill University Road, Subhash Nagar, Dehradun',

            fullAddress: 'Graphic Era Hill University Road, Subhash Nagar, Dehradun',

            price: 9500,

            type: 'co-ed',

            facilities: ['WiFi', 'Tiffin System (No Mess)', 'Laundry Service'],

            images: [pgImages.galaxy, '🏠', '📶'],

            rating: 4.6,

            distance: '0.5 km',

            contact: '+91 9876543215',

            owner: 'Mrs. Mehta',

            image: pgImages.galaxy,

            roomTypes: [

                { type: 'Single Room', price: 11000, available: 3 },

                { type: 'Double Sharing', price: 9500, available: 6 },

                { type: 'Triple Sharing', price: 8000, available: 4 }

            ]

        }

    ];



    useEffect(() => {

        // Load owner-added PGs from localStorage

        const storedPGs = localStorage.getItem('all_pgs');

        if (storedPGs) {

            const ownerPGs = JSON.parse(storedPGs);

            const allPGsCombined = [...allPGs, ...ownerPGs];

            const uniquePGs = allPGsCombined.filter((pg, index, self) => 

                index === self.findIndex(p => p.id === pg.id)

            );

            setAllPGs(uniquePGs);

        } else {

            setAllPGs(allPGs);

        }

    }, []);



    const [allPGsState, setAllPGs] = useState(allPGs);



    // Get unique facilities for filter

    const allFacilities = [...new Set(allPGsState.flatMap(pg => pg.facilities))];



    // Filter PGs based on selection

    const filteredPGs = allPGsState.filter(pg => {

        const matchesGender = selectedGender === 'all' || pg.type === selectedGender;

        const matchesPrice = pg.price >= priceRange[0] && pg.price <= priceRange[1];

        const matchesSearch = pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

                              pg.address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFacility = selectedFacility === '' || pg.facilities.includes(selectedFacility);

        return matchesGender && matchesPrice && matchesSearch && matchesFacility;

    });



    const getTypeColor = (type) => {

        if (type === 'boys') return '#3498db';

        if (type === 'girls') return '#e91e63';

        return '#9b59b6';

    };



    const getTypeLabel = (type) => {

        if (type === 'boys') return 'Boys PG';

        if (type === 'girls') return 'Girls PG';

        return 'Co-ed PG';

    };



    return (

        <div className="explore-page">

            {/* Hero Banner */}

            <div className="explore-hero">

                <h1>Find Your Perfect PG Near Graphic Era</h1>

                <p>Discover safe, comfortable, and affordable accommodations from our verified listings</p>

            </div>



            <div className="explore-content">

                {/* Filter Sidebar */}

                <div className="filter-sidebar">

                    <h3>Filters</h3>

                    

                    <div className="filter-group">

                        <label>Gender Type</label>

                        <div className="gender-filters">

                            <button 

                                className={`filter-btn ${selectedGender === 'all' ? 'active' : ''}`}

                                onClick={() => setSelectedGender('all')}

                            >

                                All

                            </button>

                            <button 

                                className={`filter-btn ${selectedGender === 'boys' ? 'active' : ''}`}

                                onClick={() => setSelectedGender('boys')}

                            >

                                Boys PG

                            </button>

                            <button 

                                className={`filter-btn ${selectedGender === 'girls' ? 'active' : ''}`}

                                onClick={() => setSelectedGender('girls')}

                            >

                                Girls PG

                            </button>

                        </div>

                    </div>



                    <div className="filter-group">

                        <label>Price Range (per month)</label>

                        <div className="price-range-slider">

                            <input

                                type="range"

                                min="0"

                                max="15000"

                                step="500"

                                value={priceRange[1]}

                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}

                            />

                            <div className="price-values">

                                <span>₹{priceRange[0]}</span>

                                <span>₹{priceRange[1]}</span>

                            </div>

                        </div>

                    </div>



                    <div className="filter-group">

                        <label>Search by Name</label>

                        <input

                            type="text"

                            placeholder="Search PG name..."

                            value={searchTerm}

                            onChange={(e) => setSearchTerm(e.target.value)}

                            className="search-input"

                        />

                    </div>



                    <div className="filter-group">

                        <label>Filter by Facility</label>

                        <select 

                            value={selectedFacility} 

                            onChange={(e) => setSelectedFacility(e.target.value)}

                            className="facility-select"

                        >

                            <option value="">All Facilities</option>

                            {allFacilities.map((facility, idx) => (

                                <option key={idx} value={facility}>{facility}</option>

                            ))}

                        </select>

                    </div>



                    <div className="results-info">

                        <strong>{filteredPGs.length}</strong> PGs found near Graphic Era

                    </div>

                    

                    {(selectedGender !== 'all' || priceRange[1] < 15000 || searchTerm || selectedFacility) && (

                        <button className="clear-filters" onClick={() => {

                            setSelectedGender('all');

                            setPriceRange([0, 15000]);

                            setSearchTerm('');

                            setSelectedFacility('');

                        }}>

                            Clear All Filters

                        </button>

                    )}

                </div>



                {/* PG Cards Grid */}

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

                                    {pg.image ? (

                                        <img 

                                            src={pg.image} 

                                            alt={pg.name}

                                            onError={(e) => {

                                                e.target.style.display = 'none';

                                                e.target.nextSibling.style.display = 'flex';

                                            }}

                                        />

                                    ) : null}

                                    <div className="image-placeholder" style={{ display: pg.image ? 'none' : 'flex' }}>

                                        🏠

                                    </div>

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

                                        <span className="pg-distance">📍 {pg.distance} from Graphic Era</span>

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