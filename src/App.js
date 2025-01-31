import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://ai-agent-backend-ttt3.onrender.com"; // Change to your FastAPI URL

function App() {
    const [message, setMessage] = useState("");
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const response = await axios.get(`${API_URL}/alerts/`);
            setAlerts(response.data.alerts);
        } catch (error) {
            console.error("Error fetching alerts:", error);
        }
    };

    const submitAlert = async () => {
        if (!message) return alert("Please enter an alert message!");

        try {
            const response = await axios.post(`${API_URL}/receive_alert/`, { message });
            alert(`AI Response: ${response.data.action_taken}`);
            setMessage(""); // Clear input
            fetchAlerts();  // Refresh the alert list
        } catch (error) {
            console.error("Error submitting alert:", error);
        }
    };

    return (
        <div className="container">
            <h1>AI-Powered Alert Management</h1>

            <div className="input-section">
                <input
                    type="text"
                    placeholder="Enter alert message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={submitAlert}>Submit Alert</button>
            </div>

            <h2>Past Alerts</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Message</th>
                        <th>Severity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.length === 0 ? (
                        <tr><td colSpan="4">No alerts submitted yet.</td></tr>
                    ) : (
                        alerts.map((alert) => (
                            <tr key={alert.id}>
                                <td>{alert.id}</td>
                                <td>{alert.message}</td>
                                <td className={`severity ${alert.severity.toLowerCase()}`}>{alert.severity}</td>
                                <td>{alert.status}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default App;