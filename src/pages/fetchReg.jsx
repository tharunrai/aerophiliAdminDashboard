import { useEffect, useState } from "react";
import { composed } from "../services/composeData";
import { FaThList, FaThLarge } from 'react-icons/fa';
import '../style/Registration.css'; 


const StatusBadge = ({ text, type }) => {
    return <span className={`status-badge status-${type}`}>{text}</span>;
};

const Registration = () => {
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    const [searchTerm, setSearchTerm] = useState(""); 

    useEffect(() => {
        composed().then(data => {
            setParticipants(data);
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching registration data:", error);
            setIsLoading(false);
        });
    }, []);
    
    const filteredParticipants = participants.filter(p => 
        p.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const renderTableView = () => (
        <div className="table-wrapper">
            <table className="registration-table">
                <thead>
                    <tr>
                        <th>Registrant Name</th>
                        <th>Event Name</th>
                        <th>Payment ID</th>
                        <th>Team Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredParticipants.map((p) => (
                        <tr key={p.id}>
                            <td>
                                <div className="user-name">{p.userName}</div>
                                <div className="user-id">{p.id}</div>
                            </td>
                            <td>{p.eventName}</td>
                            <td>
                                {p.payment_id ? 
                                    <StatusBadge text={p.payment_id} type="paid" /> : 
                                    <StatusBadge text="Pending" type="pending" />
                                }
                            </td>
                            <td>{p.teamName || "N/A"}</td>
                            <td>
                                {p.status ? 
                                    <StatusBadge text="Verified" type="verified" /> : 
                                    <StatusBadge text="Unverified" type="unverified" />
                                }
                            </td>
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
                                    <StatusBadge text={p.payment_id} type="paid" /> : 
                                    <StatusBadge text="Pending" type="pending" />
                                }
                           </span>
                        </div>
                        <div className="info-row">
                            <span className="label">Status:</span>
                            <span className="value">
                                {p.status ? 
                                    <StatusBadge text="Verified" type="verified" /> : 
                                    <StatusBadge text="Unverified" type="unverified" />
                                }
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
                    <h1>Aerophilia Registrations</h1>
                    <p>Showing {filteredParticipants.length} of {participants.length} total participants.</p>
                </div>
                <div className="controls">
                    <div className="control-group">
                        <label htmlFor="search-input">Search by Name</label>
                        <input 
                            id="search-input"
                            type="text" 
                            placeholder="Enter name..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
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