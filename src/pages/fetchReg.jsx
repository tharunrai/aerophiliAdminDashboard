import { useEffect, useState } from "react";
import { composed, getPhoneNo } from "../services/composeData";
import { FaThList, FaThLarge } from 'react-icons/fa';
import '../style/Registration.css';



const Registration = () => {
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'paid', 'pending' 
    const [phoneNumbers , setPhoneNumbers] = useState(null)

    const formatDate = (timestamp) => {
    const date = timestamp.toDate(); 
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const year = String(date.getFullYear()).slice(-2); 
    return `${day}/${month}/${year}`;
    };


    useEffect(() => {
        composed().then(data => {
            setParticipants(data);
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching registration data:", error);
            setIsLoading(false);
        });

        getPhoneNo()
        .then(numbers =>{
            setPhoneNumbers(numbers)
        })
        .catch(() => {});
    }, []);
    
    const filteredParticipants = participants.filter(p => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = p.eventName.toLowerCase().includes(searchLower) || 
                              p.userName.toLowerCase().includes(searchLower);
        const matchesPayment = paymentFilter === 'all' || 
            (paymentFilter === 'paid' && p.payment_id) || 
            (paymentFilter === 'pending' && !p.payment_id);
        return matchesSearch && matchesPayment;
    });



    const renderTableView = () => (
        <div className="table-wrapper">
            <table className="registration-table">
                <thead>
                    <tr>
                        <th>Registrant Name</th>
                        <th>Created at</th>
                        <th>Event Name</th>
                        <th>Payment ID</th>
                        <th>Team Name</th>
                        {/* <th>Status</th> */}
                        <th>Amount</th>
                        <th>Phone Number</th>
                        <th>Accomodation</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredParticipants.map((p) => (
                        <tr key={p.id}>
                            <td>
                                <div className="user-name">{p.userName}</div>
                                <div className="user-id">{p.id}</div>
                            </td>
                            <td>{formatDate(p.createdAt)}</td>
                            <td>{p.eventName}</td>
                            <td>
                                {p.payment_id ? 
                                    <span style={{ color: '#10b981' }}>{p.payment_id}</span> : 
                                    <span style={{ color: '#f59e0b' }}>Pending</span>
                                }
                            </td>
                            <td>{p.teamName || "N/A"}</td>
                            {/* <td>
                                {p.status ? 
                                    <span style={{ color: '#10b981' }}>Verified</span> : 
                                    <span style={{ color: '#ef4444' }}>Unverified</span>
                                }
                            </td> */}
                            
                            <td>{p.eventAmount}</td>
                            <td>{p.phoneNo || phoneNumbers[participants.indexOf(p)] || "N/A"}</td>
                            {console.log(p.teamAcc)}
                            <td>{p.teamAcc}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderCardView = () => (
        <div className="card-grid">
            {filteredParticipants.map((p) => (
                <div className="registration-card" key={p.id}>
                    <div className="card-header">
                        <span className="user-id"><b>Id : </b>{p.id}</span>
                    </div>
                    <div className="card-body">
                        <div className="info-row">
                            <span className="label">Name:</span>
                            <span className="value">{p.userName}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Created At:</span>
                            <span className="value">{formatDate(p.createdAt)}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Event:</span>
                            <span className="value">{p.eventName}</span>
                        </div>
                         <div className="info-row">
                            <span className="label">Team:</span>
                            <span className="value">{p.teamName || "N/A"}</span>
                        </div>
                        <div className="info-row">
                           <span className="label">Payment:</span>
                           <span className="value">
                                {p.payment_id ? 
                                    <span style={{ color: '#10b981' }}>{p.payment_id}</span> : 
                                    <span style={{ color: '#f59e0b' }}>Pending</span>
                                }
                           </span>
                        </div>
                        {/* <div className="info-row">
                            <span className="label">Status:</span>
                            <span className="value">
                                {p.status ? 
                                    <span style={{ color: '#10b981' }}>Verified</span> : 
                                    <span style={{ color: '#ef4444' }}>Unverified</span>
                                }
                            </span>
                        </div> */}
                        
                        <div className="info-row">
                            <span className="label">Amount:</span>
                            <span className="value">{p.eventAmount}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Phone No. :</span>
                            <span className="value">{p.phoneNo || phoneNumbers[participants.indexOf(p)] || "N/A"}</span>
                        </div>
                             <div className="info-row">
                            <span className="label">Accommodation:</span>
                            <span className="value">
                                {p.teamAcc }
                            </span>
                        </div>
                        
                    </div>
                </div>
            ))}
        </div>
    );

    if (isLoading) {
        return <div className="dashboard-container"><div className="loading-container">Loading Registrations...</div></div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <div className="dashboard-img"><img src="https://aerophilia.space/alogo.svg" width='70px' alt="" /></div>
                    <div>
                        <h1>Aerophilia Registrations</h1>
                        <p>Showing {filteredParticipants.length} of {participants.length} total participants.</p>
                    </div>
                </div>
                <div className="controls">
                    <div className="control-group">
                        <label htmlFor="search-input">Search by Name/Event</label>
                        <input 
                            id="search-input"
                            type="text" 
                            placeholder="Enter name or event..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="control-group">
                        <label>Payment Filter</label>
                        <div className="payment-filter">
                            <button 
                                onClick={() => setPaymentFilter('all')} 
                                className={paymentFilter === 'all' ? 'active' : ''}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setPaymentFilter('paid')} 
                                className={paymentFilter === 'paid' ? 'active' : ''}
                            >
                                Paid
                            </button>
                            <button 
                                onClick={() => setPaymentFilter('pending')} 
                                className={paymentFilter === 'pending' ? 'active' : ''}
                            >
                                Pending
                            </button>
                        </div>
                    </div>
                    <div className="control-group">
                        <label>View</label>
                        <div className="view-toggle">
                            <button aria-label="Switch to table view" onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'active' : ''}><FaThList /></button>
                            <button aria-label="Switch to card view" onClick={() => setViewMode('card')} className={viewMode === 'card' ? 'active' : ''}><FaThLarge /></button>
                        </div>
                    </div>
                </div>
            </header>
            
            {filteredParticipants.length > 0 ? 
                (viewMode === 'table' ? renderTableView() : renderCardView()) :
                <div className="no-results">No participants found matching "{searchTerm}".</div>
            }
        </div>
    );
}

export default Registration;