import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [pg, setPg] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [bookingRequests, setBookingRequests] = useState([]);
    const [payments, setPayments] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showChatModal, setShowChatModal] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        price: '',
        type: 'boys',
        facilities: [],
        totalRooms: '',
        availableRooms: '',
        description: '',
        contactNumber: '',
        images: []
    });
    const [facilityInput, setFacilityInput] = useState('');

    // DEFAULT PG for owner (so it never shows 0)
    const DEFAULT_PG = {
        id: 1,
        name: 'Solitaire PG for Girls',
        address: '154/2-1, Bell Road, Society Area, Subhash Nagar, Dehradun',
        price: 12000,
        type: 'girls',
        facilities: ['Mess Available', 'Water Purifier', 'WiFi', 'Security'],
        totalRooms: 15,
        availableRooms: 6,
        description: 'Premium girls hostel with excellent facilities',
        contactNumber: '+91 9876543212',
        ownerId: 'owner_1',
        ownerName: 'Kartik',
        status: 'active'
    };

    // DEFAULT TENANTS for owner
    const DEFAULT_TENANTS = [
        { id: 1, name: 'Neha Singh', roomType: 'Double Sharing', checkIn: '2026-04-01', rent: 8000, phone: '+91 9876543210', studentId: 'student_1', paymentStatus: 'pending', paymentAmount: 8000, dueDate: '2026-05-05' },
        { id: 2, name: 'Priya Sharma', roomType: 'Single Room', checkIn: '2026-04-05', rent: 12000, phone: '+91 9876543211', studentId: 'student_2', paymentStatus: 'paid', paymentAmount: 12000, dueDate: '2026-05-05' },
        { id: 3, name: 'Anjali Verma', roomType: 'Triple Sharing', checkIn: '2026-03-15', rent: 6000, phone: '+91 9876543212', studentId: 'student_3', paymentStatus: 'overdue', paymentAmount: 6000, dueDate: '2026-04-05' }
    ];

    // DEFAULT BOOKING REQUESTS
    const DEFAULT_REQUESTS = [
        { id: 101, studentName: 'Riya Mehta', roomType: 'Single Room', duration: 6, monthlyRent: 12000, totalAmount: 72000, bookingFee: 500, moveInDate: '2026-05-01', studentPhone: '+91 9876543213', studentId: 'student_4', status: 'pending', message: 'Need vegetarian food facility', ownerId: 'owner_1', pgName: 'Solitaire PG for Girls' },
        { id: 102, studentName: 'Simran Kaur', roomType: 'Double Sharing', duration: 3, monthlyRent: 8000, totalAmount: 24000, bookingFee: 500, moveInDate: '2026-05-10', studentPhone: '+91 9876543214', studentId: 'student_5', status: 'pending', message: 'Need parking space', ownerId: 'owner_1', pgName: 'Solitaire PG for Girls' }
    ];

    useEffect(() => {
        if (user && user.role === 'owner') {
            loadDashboardData();
            loadChatHistory();
        }
    }, [user]);

    const loadChatHistory = () => {
        const savedChats = localStorage.getItem(`owner_chats_${user.id}`);
        if (savedChats) {
            setChatHistory(JSON.parse(savedChats));
        }
    };

    const saveChatHistory = (studentId, messages) => {
        const updated = { ...chatHistory, [studentId]: messages };
        setChatHistory(updated);
        localStorage.setItem(`owner_chats_${user.id}`, JSON.stringify(updated));
    };

    const sendChatMessage = (studentId, studentName) => {
        if (!chatMessage.trim()) return;
        
        const newMessage = {
            id: Date.now(),
            sender: 'owner',
            message: chatMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        const existingMessages = chatHistory[studentId] || [];
        const updatedMessages = [...existingMessages, newMessage];
        saveChatHistory(studentId, updatedMessages);
        setChatMessage('');
    };

    const loadDashboardData = () => {
        // Load saved PG or use DEFAULT
        const savedPG = localStorage.getItem(`owner_pg_${user.id}`);
        if (savedPG) {
            setPg(JSON.parse(savedPG));
        } else {
            // Set default PG for owner
            setPg(DEFAULT_PG);
            localStorage.setItem(`owner_pg_${user.id}`, JSON.stringify(DEFAULT_PG));
        }
        
        // Load tenants - use DEFAULT if none exists
        const savedTenants = localStorage.getItem(`owner_tenants_${user.id}`);
        if (savedTenants) {
            setTenants(JSON.parse(savedTenants));
        } else {
            setTenants(DEFAULT_TENANTS);
            localStorage.setItem(`owner_tenants_${user.id}`, JSON.stringify(DEFAULT_TENANTS));
        }
        
        // Load booking requests - use DEFAULT if none exists
        const savedRequests = localStorage.getItem(`owner_requests_${user.id}`);
        if (savedRequests) {
            setBookingRequests(JSON.parse(savedRequests));
        } else {
            setBookingRequests(DEFAULT_REQUESTS);
            localStorage.setItem(`owner_requests_${user.id}`, JSON.stringify(DEFAULT_REQUESTS));
        }
        
        // Load payments
        const allPayments = JSON.parse(localStorage.getItem('all_payments') || '[]');
        const ownerPayments = allPayments.filter(p => p.ownerId === user.id);
        setPayments(ownerPayments);
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

    const handleSubmitPG = (e) => {
        e.preventDefault();
        
        const newPG = {
            id: Date.now(),
            name: formData.name,
            address: formData.address,
            price: parseInt(formData.price),
            type: formData.type,
            facilities: formData.facilities,
            totalRooms: parseInt(formData.totalRooms) || 10,
            availableRooms: parseInt(formData.availableRooms) || 5,
            description: formData.description,
            contactNumber: formData.contactNumber,
            ownerId: user.id,
            ownerName: user.name,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem(`owner_pg_${user.id}`, JSON.stringify(newPG));
        setPg(newPG);
        setShowAddForm(false);
        alert('PG added successfully!');
    };

    const handleBookingRequest = (requestId, action) => {
        const request = bookingRequests.find(r => r.id === requestId);
        if (!request) return;
        
        if (action === 'accept') {
            // Create new tenant from booking request
            const newTenant = {
                id: Date.now(),
                name: request.studentName,
                roomType: request.roomType,
                checkIn: request.moveInDate,
                rent: request.monthlyRent,
                phone: request.studentPhone,
                studentId: request.studentId,
                paymentStatus: 'pending',
                paymentAmount: request.monthlyRent,
                dueDate: new Date(new Date(request.moveInDate).setMonth(new Date(request.moveInDate).getMonth() + 1)).toISOString().split('T')[0]
            };
            
            const updatedTenants = [...tenants, newTenant];
            setTenants(updatedTenants);
            localStorage.setItem(`owner_tenants_${user.id}`, JSON.stringify(updatedTenants));
            
            alert(`✅ Booking accepted! ${request.studentName} has been added to your tenants.`);
        } else {
            alert(`❌ Booking declined for ${request.studentName}.`);
        }
        
        // Remove from pending requests
        const updatedRequests = bookingRequests.filter(r => r.id !== requestId);
        setBookingRequests(updatedRequests);
        localStorage.setItem(`owner_requests_${user.id}`, JSON.stringify(updatedRequests));
    };

    const handleMarkPayment = (tenantId, status) => {
        const updatedTenants = tenants.map(tenant => 
            tenant.id === tenantId ? { ...tenant, paymentStatus: status } : tenant
        );
        setTenants(updatedTenants);
        localStorage.setItem(`owner_tenants_${user.id}`, JSON.stringify(updatedTenants));
        
        // Also save to payments record
        const tenant = tenants.find(t => t.id === tenantId);
        const paymentRecord = {
            id: Date.now(),
            tenant: tenant.name,
            month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
            amount: tenant.rent,
            status: status,
            ownerId: user.id,
            date: new Date().toISOString()
        };
        const allPayments = JSON.parse(localStorage.getItem('all_payments') || '[]');
        allPayments.push(paymentRecord);
        localStorage.setItem('all_payments', JSON.stringify(allPayments));
        
        alert(`Payment marked as ${status} for ${tenant.name}`);
    };

    if (!user || user.role !== 'owner') {
        return (
            <div className="dashboard-container">
                <div className="error-card">
                    <h2>Access Denied</h2>
                    <p>This page is only for PG owners.</p>
                </div>
            </div>
        );
    }

    const totalRentCollected = tenants.filter(t => t.paymentStatus === 'paid').reduce((sum, t) => sum + t.rent, 0);
    const totalPendingRent = tenants.filter(t => t.paymentStatus === 'pending').reduce((sum, t) => sum + t.rent, 0);
    const totalOverdueRent = tenants.filter(t => t.paymentStatus === 'overdue').reduce((sum, t) => sum + t.rent, 0);

    return (
        <div className="owner-dashboard">
            <div className="dashboard-header">
                <h1>Owner Dashboard</h1>
                <p>Welcome back, {user.name}! Manage your PG and tenants here.</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🏠</div>
                    <div className="stat-info">
                        <h3>{pg ? '1' : '0'}</h3>
                        <p>PG Listed</p>
                        {pg && <small style={{fontSize: '0.7rem'}}>₹{pg.price}/month</small>}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{tenants.length}</h3>
                        <p>Current Tenants</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>₹{totalRentCollected.toLocaleString()}</h3>
                        <p>Total Collected</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{bookingRequests.length}</h3>
                        <p>Pending Requests</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="dashboard-tabs">
                <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📊 Overview</button>
                <button className={`tab-btn ${activeTab === 'pg' ? 'active' : ''}`} onClick={() => setActiveTab('pg')}>🏠 My PG</button>
                <button className={`tab-btn ${activeTab === 'tenants' ? 'active' : ''}`} onClick={() => setActiveTab('tenants')}>👥 Tenants ({tenants.length})</button>
                <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>📝 Requests ({bookingRequests.length})</button>
                <button className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>💳 Payments</button>
            </div>

            <div className="dashboard-content">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="overview-tab">
                        <div className="welcome-card">
                            <h2>Welcome to Your Dashboard</h2>
                            <p>Here's what's happening with your PG today</p>
                            {pg && (
                                <div style={{marginTop: '1rem', textAlign: 'left', background: '#f7fafc', padding: '1rem', borderRadius: '12px'}}>
                                    <h4>Your PG: {pg.name}</h4>
                                    <p>📍 {pg.address}</p>
                                    <p>💰 Rent: ₹{pg.price}/month</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PG Tab */}
                {activeTab === 'pg' && (
                    <div className="pg-tab">
                        {pg ? (
                            <div className="pg-card-detail">
                                <h3>Your PG Listing</h3>
                                <div className="pg-detail-info">
                                    <h4>{pg.name}</h4>
                                    <p>{pg.address}</p>
                                    <div className="pg-detail-stats">
                                        <span>💰 ₹{pg.price}/month</span>
                                        <span>👥 {pg.type === 'boys' ? 'Boys PG' : pg.type === 'girls' ? 'Girls PG' : 'Co-ed PG'}</span>
                                        <span>🛏️ {pg.availableRooms}/{pg.totalRooms} rooms available</span>
                                    </div>
                                    <div className="pg-facilities-list">
                                        <strong>Facilities:</strong>
                                        {pg.facilities && pg.facilities.map((fac, idx) => (<span key={idx} className="facility-tag">{fac}</span>))}
                                    </div>
                                </div>
                            </div>
                        ) : showAddForm ? (
                            <form onSubmit={handleSubmitPG} className="add-pg-form">
                                <h3>Add Your PG</h3>
                                <input type="text" placeholder="PG Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                                <input type="text" placeholder="Full Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" />
                                <input type="number" placeholder="Price per month" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                                <input type="tel" placeholder="Contact Number" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} required />
                                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                    <option value="boys">Boys PG</option><option value="girls">Girls PG</option><option value="co-ed">Co-ed PG</option>
                                </select>
                                <div className="room-inputs">
                                    <input type="number" placeholder="Total Rooms" value={formData.totalRooms} onChange={(e) => setFormData({...formData, totalRooms: e.target.value})} />
                                    <input type="number" placeholder="Available Rooms" value={formData.availableRooms} onChange={(e) => setFormData({...formData, availableRooms: e.target.value})} />
                                </div>
                                <div className="facilities-input">
                                    <input type="text" value={facilityInput} onChange={(e) => setFacilityInput(e.target.value)} placeholder="Add facility" />
                                    <button type="button" onClick={handleAddFacility}>Add</button>
                                </div>
                                <div className="facilities-list">{formData.facilities.map((fac, idx) => (<span key={idx} className="facility-tag">{fac}<button type="button" onClick={() => removeFacility(idx)}>×</button></span>))}</div>
                                <div className="form-actions"><button type="submit" className="submit-btn">Submit Listing</button><button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">Cancel</button></div>
                            </form>
                        ) : (
                            <div className="empty-state"><p>You haven't added any PG yet.</p><button onClick={() => setShowAddForm(true)} className="add-btn">+ Add Your First PG</button></div>
                        )}
                    </div>
                )}

                {/* Tenants Tab - WITH PAID/UNPAID/OVERDUE BUTTONS */}
                {activeTab === 'tenants' && (
                    <div className="tenants-tab">
                        <h3>Current Tenants ({tenants.length})</h3>
                        {tenants.length === 0 ? (<p className="empty-text">No tenants yet.</p>) : (
                            <div className="tenants-table">
                                <div className="table-header">
                                    <span>Name</span>
                                    <span>Room Type</span>
                                    <span>Check-in</span>
                                    <span>Rent</span>
                                    <span>Due Date</span>
                                    <span>Status</span>
                                    <span>Action</span>
                                </div>
                                {tenants.map(tenant => (
                                    <div key={tenant.id} className="table-row">
                                        <span><strong>{tenant.name}</strong></span>
                                        <span>{tenant.roomType}</span>
                                        <span>{tenant.checkIn}</span>
                                        <span>₹{tenant.rent}</span>
                                        <span>{tenant.dueDate || '5th of month'}</span>
                                        <span className={`status-badge ${tenant.paymentStatus}`}>
                                            {tenant.paymentStatus === 'paid' ? '✓ Paid' : tenant.paymentStatus === 'pending' ? '⏳ Pending' : '❗ Overdue'}
                                        </span>
                                        <span>
                                            <button onClick={() => handleMarkPayment(tenant.id, 'paid')} style={{background:'#48bb78',color:'white',border:'none',padding:'0.3rem 0.8rem',borderRadius:'5px',cursor:'pointer',marginRight:'0.3rem'}}>✓ Paid</button>
                                            <button onClick={() => handleMarkPayment(tenant.id, 'pending')} style={{background:'#ed8936',color:'white',border:'none',padding:'0.3rem 0.8rem',borderRadius:'5px',cursor:'pointer',marginRight:'0.3rem'}}>⏳ Pending</button>
                                            <button onClick={() => handleMarkPayment(tenant.id, 'overdue')} style={{background:'#f56565',color:'white',border:'none',padding:'0.3rem 0.8rem',borderRadius:'5px',cursor:'pointer'}}>❗ Overdue</button>
                                            <button onClick={() => setShowChatModal(tenant)} style={{background:'#3498db',color:'white',border:'none',padding:'0.3rem 0.8rem',borderRadius:'5px',cursor:'pointer',marginLeft:'0.3rem'}}>💬</button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Requests Tab - WITH ACCEPT/DECLINE */}
                {activeTab === 'requests' && (
                    <div className="requests-tab">
                        <h3>Booking Requests ({bookingRequests.length})</h3>
                        {bookingRequests.length === 0 ? (<p className="empty-text">No pending booking requests.</p>) : (
                            <div className="requests-list">
                                {bookingRequests.map(request => (
                                    <div key={request.id} className="request-item">
                                        <div className="request-info">
                                            <h4>{request.studentName}</h4>
                                            <p>📞 {request.studentPhone}</p>
                                            <p>🏠 {request.pgName || 'Solitaire PG'}</p>
                                            <p>🛏️ {request.roomType} • {request.duration} month(s)</p>
                                            <p>📅 Move-in: {request.moveInDate}</p>
                                            <p>💰 Monthly Rent: ₹{request.monthlyRent}</p>
                                            <p>💵 Booking Fee: ₹500</p>
                                            {request.message && <p className="request-message">💬 "{request.message}"</p>}
                                        </div>
                                        <div className="request-actions">
                                            <button onClick={() => setShowChatModal(request)} style={{background:'#3498db',color:'white',border:'none',padding:'0.5rem 1rem',borderRadius:'8px',cursor:'pointer',marginRight:'0.5rem'}}>💬 Chat</button>
                                            <button onClick={() => handleBookingRequest(request.id, 'accept')} className="accept-btn">✓ Accept</button>
                                            <button onClick={() => handleBookingRequest(request.id, 'decline')} className="decline-btn">✗ Decline</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div className="payments-tab">
                        <h3>Payment Tracker</h3>
                        <div className="payments-summary">
                            <div className="summary-card"><span>Total Collected</span><strong>₹{totalRentCollected.toLocaleString()}</strong></div>
                            <div className="summary-card pending"><span>Pending</span><strong>₹{totalPendingRent.toLocaleString()}</strong></div>
                            <div className="summary-card overdue"><span>Overdue</span><strong>₹{totalOverdueRent.toLocaleString()}</strong></div>
                        </div>
                        <div className="payments-table">
                            <div className="table-header"><span>Tenant</span><span>Monthly Rent</span><span>Status</span><span>Action</span></div>
                            {tenants.map(tenant => (
                                <div key={tenant.id} className="table-row">
                                    <span>{tenant.name}</span>
                                    <span>₹{tenant.rent}</span>
                                    <span className={`status-badge ${tenant.paymentStatus}`}>{tenant.paymentStatus === 'paid' ? '✓ Paid' : tenant.paymentStatus === 'pending' ? '⏳ Pending' : '❗ Overdue'}</span>
                                    <span>{tenant.paymentStatus !== 'paid' && <button onClick={() => handleMarkPayment(tenant.id, 'paid')} className="mark-paid-btn">Mark Paid</button>}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Modal */}
            {showChatModal && (
                <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
                    <div style={{background:'white',borderRadius:'20px',width:'90%',maxWidth:'450px',maxHeight:'80vh',display:'flex',flexDirection:'column',overflow:'hidden'}}>
                        <div style={{background:'linear-gradient(135deg, #534AB7 0%, #6B5FD6 100%)',color:'white',padding:'1rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <h3 style={{margin:0}}>💬 Chat with {showChatModal.studentName}</h3>
                            <button onClick={() => setShowChatModal(null)} style={{background:'none',border:'none',color:'white',fontSize:'1.5rem',cursor:'pointer'}}>×</button>
                        </div>
                        <div style={{flex:1,padding:'1rem',overflowY:'auto',minHeight:'300px'}}>
                            {(chatHistory[showChatModal.studentId] || []).map((msg, idx) => (
                                <div key={idx} style={{textAlign:msg.sender === 'owner' ? 'right' : 'left',marginBottom:'0.8rem'}}>
                                    <div style={{display:'inline-block',background:msg.sender === 'owner' ? '#534AB7' : '#e2e8f0',color:msg.sender === 'owner' ? 'white' : '#2d3748',padding:'0.5rem 1rem',borderRadius:'15px',maxWidth:'80%'}}>{msg.message}</div>
                                    <div style={{fontSize:'0.7rem',color:'#718096',marginTop:'0.2rem'}}>{msg.time}</div>
                                </div>
                            ))}
                            {(chatHistory[showChatModal.studentId] || []).length === 0 && <p style={{textAlign:'center',color:'#718096',padding:'2rem'}}>No messages yet.</p>}
                        </div>
                        <div style={{padding:'1rem',borderTop:'1px solid #e2e8f0',display:'flex',gap:'0.5rem'}}>
                            <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChatMessage(showChatModal.studentId, showChatModal.studentName)} placeholder="Type your message..." style={{flex:1,padding:'0.7rem',border:'1px solid #e2e8f0',borderRadius:'10px',outline:'none'}} />
                            <button onClick={() => sendChatMessage(showChatModal.studentId, showChatModal.studentName)} style={{padding:'0.7rem 1.2rem',background:'#534AB7',color:'white',border:'none',borderRadius:'10px',cursor:'pointer'}}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;