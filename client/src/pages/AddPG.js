import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AddPG.css';

const AddPG = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        fullAddress: '',
        price: '',
        type: 'boys',
        description: '',
        contactNumber: '',
        totalRooms: '',
        availableRooms: '',
        facilities: [],
        images: [],
        location: { lat: 30.3165, lng: 78.0322 },
        rating: 4.5,
        distance: '0.8 km'
    });
    const [facilityInput, setFacilityInput] = useState('');
    const [imageInput, setImageInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    // Check if user is logged in and is owner
    if (!user) {
        return (
            <div className="addpg-container">
                <div className="error-card">
                    <h2>Access Denied</h2>
                    <p>Please login to add a PG listing.</p>
                    <button onClick={() => navigate('/login')} className="login-btn">Login</button>
                </div>
            </div>
        );
    }

    if (user.role !== 'owner') {
        return (
            <div className="addpg-container">
                <div className="error-card">
                    <h2>Access Denied</h2>
                    <p>Only PG owners can add listings.</p>
                    <button onClick={() => navigate('/')} className="login-btn">Go Home</button>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddFacility = () => {
        if (facilityInput.trim()) {
            setFormData({
                ...formData,
                facilities: [...formData.facilities, facilityInput.trim()]
            });
            setFacilityInput('');
        }
    };

    const removeFacility = (index) => {
        const newFacilities = formData.facilities.filter((_, i) => i !== index);
        setFormData({ ...formData, facilities: newFacilities });
    };

    const handleAddImage = () => {
        if (imageInput.trim()) {
            setFormData({
                ...formData,
                images: [...formData.images, imageInput.trim()]
            });
            setImageInput('');
        }
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.address || !formData.price || !formData.contactNumber) {
            setError('Please fill all required fields');
            return;
        }

        // Create new PG object
        const newPG = {
            id: Date.now(),
            name: formData.name,
            address: formData.address,
            fullAddress: formData.fullAddress || formData.address,
            price: parseInt(formData.price),
            type: formData.type,
            description: formData.description || `Beautiful ${formData.type === 'boys' ? 'Boys' : formData.type === 'girls' ? 'Girls' : 'Co-ed'} PG with all modern amenities.`,
            contactNumber: formData.contactNumber,
            totalRooms: parseInt(formData.totalRooms) || 10,
            availableRooms: parseInt(formData.availableRooms) || 5,
            facilities: formData.facilities,
            images: formData.images.length > 0 ? formData.images : ['🏠'],
            location: formData.location,
            rating: 4.5,
            distance: formData.distance,
            ownerId: user.id,
            ownerName: user.name,
            roomTypes: [
                { type: 'Single Room', price: parseInt(formData.price) + 2000, available: Math.floor(parseInt(formData.availableRooms) / 3) },
                { type: 'Double Sharing', price: parseInt(formData.price), available: Math.floor(parseInt(formData.availableRooms) / 2) },
                { type: 'Triple Sharing', price: parseInt(formData.price) - 1500, available: Math.floor(parseInt(formData.availableRooms) / 3) }
            ]
        };

        // Get existing PGs from localStorage
        const existingPGs = JSON.parse(localStorage.getItem('all_pgs') || '[]');
        existingPGs.push(newPG);
        localStorage.setItem('all_pgs', JSON.stringify(existingPGs));
        
        // Save owner's PG
        localStorage.setItem(`owner_pg_${user.id}`, JSON.stringify(newPG));
        
        setSuccess('PG added successfully! It will now appear in Explore PGs.');
        setError('');
        
        // Reset form after 2 seconds
        setTimeout(() => {
            setSuccess('');
            navigate('/dashboard');
        }, 2000);
    };

    const nextStep = () => {
        if (currentStep === 1 && (!formData.name || !formData.address || !formData.price)) {
            setError('Please fill basic information before proceeding');
            return;
        }
        setError('');
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        setError('');
    };

    return (
        <div className="addpg-container">
            <div className="addpg-card">
                <div className="addpg-header">
                    <h1>Add Your PG</h1>
                    <p>Fill in the details below to list your PG on PG Finder</p>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Basic Info</span>
                    </div>
                    <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Facilities & Rooms</span>
                    </div>
                    <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Photos & Submit</span>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="addpg-form">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="form-step">
                            <div className="form-group">
                                <label>PG Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g., Vallestay Girls Hostel"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="e.g., Shiv Vihar, Saharanpur Road"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Full Address (Optional)</label>
                                <textarea
                                    name="fullAddress"
                                    placeholder="Complete address with landmark, city, pincode"
                                    value={formData.fullAddress}
                                    onChange={handleChange}
                                    rows="2"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price per month (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="e.g., 8000"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>PG Type *</label>
                                    <select name="type" value={formData.type} onChange={handleChange}>
                                        <option value="boys">Boys PG</option>
                                        <option value="girls">Girls PG</option>
                                        <option value="co-ed">Co-ed PG</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Describe your PG - location, ambiance, special features..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact Number *</label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    placeholder="Your contact number"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="button" className="next-btn" onClick={nextStep}>
                                Next: Facilities & Rooms →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Facilities & Rooms */}
                    {currentStep === 2 && (
                        <div className="form-step">
                            <div className="form-group">
                                <label>Facilities & Amenities</label>
                                <div className="facilities-input-group">
                                    <input
                                        type="text"
                                        value={facilityInput}
                                        onChange={(e) => setFacilityInput(e.target.value)}
                                        placeholder="e.g., WiFi, Kitchen, Laundry"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFacility())}
                                    />
                                    <button type="button" onClick={handleAddFacility}>Add</button>
                                </div>
                                <div className="facilities-list">
                                    {formData.facilities.map((facility, idx) => (
                                        <span key={idx} className="facility-tag">
                                            {facility}
                                            <button type="button" onClick={() => removeFacility(idx)}>×</button>
                                        </span>
                                    ))}
                                    {formData.facilities.length === 0 && (
                                        <p className="hint">Add facilities like: WiFi, Kitchen, Parking, CCTV, etc.</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Total Rooms</label>
                                    <input
                                        type="number"
                                        name="totalRooms"
                                        placeholder="Total number of rooms"
                                        value={formData.totalRooms}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Available Rooms</label>
                                    <input
                                        type="number"
                                        name="availableRooms"
                                        placeholder="Currently available rooms"
                                        value={formData.availableRooms}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Distance from Graphic Era</label>
                                <input
                                    type="text"
                                    name="distance"
                                    placeholder="e.g., 0.8 km"
                                    value={formData.distance}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="prev-btn" onClick={prevStep}>
                                    ← Back
                                </button>
                                <button type="button" className="next-btn" onClick={nextStep}>
                                    Next: Photos →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Photos & Submit */}
                    {currentStep === 3 && (
                        <div className="form-step">
                            <div className="form-group">
                                <label>Photos (Optional)</label>
                                <div className="images-input-group">
                                    <input
                                        type="text"
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        placeholder="Add photo URL or emoji (e.g., 🏠, 🛏️)"
                                    />
                                    <button type="button" onClick={handleAddImage}>Add</button>
                                </div>
                                <div className="images-list">
                                    {formData.images.map((image, idx) => (
                                        <span key={idx} className="image-tag">
                                            {image}
                                            <button type="button" onClick={() => removeImage(idx)}>×</button>
                                        </span>
                                    ))}
                                    <p className="hint">Add photos or emojis to represent your PG</p>
                                </div>
                            </div>

                            <div className="preview-section">
                                <h4>Preview</h4>
                                <div className="preview-card">
                                    <div className="preview-image">
                                        {formData.images[0] || '🏠'}
                                    </div>
                                    <div className="preview-info">
                                        <h3>{formData.name || 'PG Name'}</h3>
                                        <p>{formData.address || 'Address'}</p>
                                        <p className="preview-price">₹{formData.price || '0'}/month</p>
                                        <span className={`preview-type ${formData.type}`}>
                                            {formData.type === 'boys' ? 'Boys PG' : formData.type === 'girls' ? 'Girls PG' : 'Co-ed PG'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="prev-btn" onClick={prevStep}>
                                    ← Back
                                </button>
                                <button type="submit" className="submit-btn">
                                    Add PG Listing
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddPG;