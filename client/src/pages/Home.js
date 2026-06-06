import React, { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import './Home.css';



const Home = () => {

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);



    const features = [

        { icon: '✅', title: 'Verified Listings', desc: 'Real PGs with real photos and prices' },

        { icon: '💬', title: 'Direct Owner Contact', desc: 'Chat directly with PG owners' },

        { icon: '🗺️', title: 'Map Directions', desc: 'See exact location near Graphic Era' },

        { icon: '💳', title: 'Secure Payments', desc: 'Pay rent online with payment history' }

    ];



    const featuredPGs = [

        { name: 'Vallestay Girls Hostel', price: '₹8,000', type: 'girls', image: '🏠' },

        { name: 'CANTRA PG', price: '₹10,000', type: 'boys', image: '🏠' },

        { name: 'Solitaire PG', price: '₹12,000', type: 'girls', image: '🏠' }

    ];



    return (

        <div className="home">

            {/* Hero Section */}

            <div className="hero-section">

                <div className="hero-content">

                    <h1>Find Your Perfect PG</h1>

                    <p>No brokers. No extra charges. Direct from owner to student.</p>

                    <div className="hero-buttons">

                        <button onClick={() => navigate('/explore')} className="btn-primary">

                            Explore PGs

                        </button>

                        {!user && (

                            <button onClick={() => navigate('/register')} className="btn-secondary">

                                List Your PG

                            </button>

                        )}

                    </div>

                </div>

            </div>



            {/* Features Bar */}

            <div className="features-bar">

                {features.map((feature, index) => (

                    <div key={index} className="feature-item">

                        <span className="feature-icon">{feature.icon}</span>

                        <div>

                            <h4>{feature.title}</h4>

                            <p>{feature.desc}</p>

                        </div>

                    </div>

                ))}

            </div>



            {/* Featured PGs */}

            <div className="featured-section">

                <h2>Featured PGs</h2>

                <p>Popular accommodations near Graphic Era Hill University</p>

                <div className="featured-grid">

                    {featuredPGs.map((pg, index) => (

                        <div key={index} className="featured-card" onClick={() => navigate('/explore')}>

                            <div className="card-image">

                                <span className="image-placeholder">{pg.image}</span>

                                <span className={`card-type ${pg.type}`}>

                                    {pg.type === 'boys' ? 'Boys PG' : 'Girls PG'}

                                </span>

                            </div>

                            <div className="card-content">

                                <h3>{pg.name}</h3>

                                <p className="price">{pg.price}<span>/month</span></p>

                                <button className="view-details">View Details →</button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>



            {/* About Section */}

            <div className="about-section">

                <div className="about-content">

                    <h2>Why PG Finder?</h2>

                    <p>

                       Stayspot was created specifically for students coming to Dehradun for studies. 

                        We understand the struggle of finding a reliable PG near college without dealing with 

                        brokers who charge extra and show outdated listings. Our platform connects students 

                        directly with PG owners, making the process transparent, fast, and hassle-free.

                    </p>

                    <p>

                        With real PGs near Graphic Era Hill University, verified photos, exact locations on 

                        Google Maps, direct chat with owners, and a complete booking & payment system, 

                        PG Finder is your trusted companion for finding home away from home.

                    </p>

                </div>

            </div>



            {/* Footer */}

            <footer className="footer">

                <div className="footer-content">

                    <div className="footer-section">

                        <h3>Stayspot</h3>

                        <p>Find your perfect stay near Graphic Era Hill University</p>

                    </div>

                    <div className="footer-section">

                        <h4>Quick Links</h4>

                        <a href="/">Home</a>

                        <a href="/explore">Explore PGs</a>

                        <a href="/contact">Contact</a>

                    </div>

                    <div className="footer-section">

                        <h4>Contact</h4>

                        <p>📧 support@Stayspot.com</p>

                        <p>📍 Dehradun, Uttarakhand</p>

                    </div>

                </div>

                <div className="footer-bottom">

                    <p>© 2024 Stayspot. All rights reserved. Made for students, by students.</p>

                </div>

            </footer>

        </div>

    );

};



export default Home;