import React, { useState, useEffect } from 'react';
import { dateToNumber, formatDateNumber } from '../utils';

export default function StudentPanel({ contract, account }) {
  const [todayPresent, setTodayPresent] = useState(null);
  const [history, setHistory] = useState([]);
  const [isRegistered, setIsRegistered] = useState(null);
  const [checkDate, setCheckDate] = useState(new Date().toISOString().slice(0,10));
  const [dateAttendance, setDateAttendance] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    checkRegistration();
  }, [account]);

  const checkRegistration = async () => {
    try {
      const registered = await contract.isStudent(account);
      setIsRegistered(registered);
      if (!registered) {
        setMsg('You are not registered as a student. Please contact your teacher.');
      } else {
        setMsg('');
      }
    } catch (e) {
      setMsg('Error checking registration: ' + (e?.error?.message || e.message));
    }
  };

  const checkToday = async () => {
    try {
      const today = new Date().toISOString().slice(0,10);
      const dateNum = dateToNumber(today);
      const present = await contract.checkAttendance(dateNum, account);
      setTodayPresent(present);
      setMsg('');
    } catch (e) {
      setMsg('Error: ' + (e?.error?.message || e.message));
    }
  };

  const checkSpecificDate = async () => {
    try {
      const dateNum = dateToNumber(checkDate);
      const present = await contract.checkAttendance(dateNum, account);
      setDateAttendance(present);
      setMsg('');
    } catch (e) {
      setMsg('Error: ' + (e?.error?.message || e.message));
      setDateAttendance(null);
    }
  };

  const loadHistory = async () => {
    try {
      const dates = await contract.getAttendanceDates(account);
      // dates are BigNumber; convert to string and sort in reverse chronological order
      const sortedDates = dates.map(d => d.toString()).sort((a, b) => parseInt(b) - parseInt(a));
      setHistory(sortedDates);
      setMsg('');
    } catch (e) {
      setMsg('Error: ' + (e?.error?.message || e.message));
    }
  };

  const getDetailedAttendance = async () => {
    try {
      const dates = await contract.getAttendanceDates(account);
      const detailed = [];
      
      for (const date of dates) {
        const dateStr = date.toString();
        const present = await contract.checkAttendance(date, account);
        detailed.push({ date: dateStr, present });
      }
      
      // Sort by date (newest first)
      detailed.sort((a, b) => parseInt(b.date) - parseInt(a.date));
      setHistory(detailed);
      setMsg('');
    } catch (e) {
      setMsg('Error loading detailed attendance: ' + (e?.error?.message || e.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Panel</h2>
      <p><strong>Your address:</strong> <code>{account}</code></p>

      <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Registration Status</h3>
        <button onClick={checkRegistration} style={{ marginBottom: '10px' }}>
          Check Registration
        </button>
        {isRegistered !== null && (
          <p style={{ 
            fontWeight: 'bold', 
            color: isRegistered ? 'green' : 'red',
            padding: '10px',
            backgroundColor: isRegistered ? '#e8f5e8' : '#ffebee',
            border: `1px solid ${isRegistered ? '#4caf50' : '#f44336'}`,
            borderRadius: '4px'
          }}>
            {isRegistered ? '✓ You are registered as a student' : '✗ You are not registered as a student'}
          </p>
        )}
      </section>

      {isRegistered && (
        <>
          <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
            <h3>Today's Attendance</h3>
            <button onClick={checkToday} style={{ marginBottom: '10px' }}>
              Check Today's Attendance
            </button>
            {todayPresent !== null && (
              <p style={{ 
                fontWeight: 'bold',
                color: todayPresent ? 'green' : 'red',
                padding: '10px',
                backgroundColor: todayPresent ? '#e8f5e8' : '#ffebee',
                border: `1px solid ${todayPresent ? '#4caf50' : '#f44336'}`,
                borderRadius: '4px'
              }}>
                Today's Status: {todayPresent ? 'Present ✓' : 'Absent ✗'}
              </p>
            )}
          </section>

          <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
            <h3>Check Specific Date</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>
                Select Date:
                <input 
                  type="date" 
                  value={checkDate} 
                  onChange={(e) => setCheckDate(e.target.value)}
                  style={{ marginLeft: '10px' }}
                />
              </label>
            </div>
            <button onClick={checkSpecificDate}>Check Attendance for Date</button>
            {dateAttendance !== null && (
              <p style={{ 
                marginTop: '10px',
                fontWeight: 'bold',
                color: dateAttendance ? 'green' : 'red'
              }}>
                Attendance on {checkDate}: {dateAttendance ? 'Present ✓' : 'Absent ✗'}
              </p>
            )}
          </section>

          <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
            <h3>Attendance History</h3>
            <div style={{ marginBottom: '15px' }}>
              <button onClick={loadHistory} style={{ marginRight: '10px' }}>
                Load Attendance Dates
              </button>
              <button onClick={getDetailedAttendance}>
                Load Detailed History
              </button>
            </div>

            {history.length > 0 && (
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
                <h4>Attendance Records ({history.length} days):</h4>
                <ul style={{ margin: 0 }}>
                  {history.map((item, index) => (
                    <li key={index} style={{ 
                      marginBottom: '8px',
                      padding: '5px',
                      backgroundColor: typeof item === 'object' ? 
                        (item.present ? '#e8f5e8' : '#ffebee') : '#f5f5f5',
                      borderRadius: '3px'
                    }}>
                      {typeof item === 'object' ? (
                        <>
                          <strong>{formatDateNumber(item.date)}</strong> - 
                          <span style={{ 
                            color: item.present ? 'green' : 'red',
                            fontWeight: 'bold',
                            marginLeft: '10px'
                          }}>
                            {item.present ? 'Present ✓' : 'Absent ✗'}
                          </span>
                        </>
                      ) : (
                        formatDateNumber(item)
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
            <h3>Attendance Summary</h3>
            {history.length > 0 && typeof history[0] === 'object' && (
              <div>
                <p><strong>Total Days Recorded:</strong> {history.length}</p>
                <p><strong>Days Present:</strong> {history.filter(item => item.present).length}</p>
                <p><strong>Days Absent:</strong> {history.filter(item => !item.present).length}</p>
                <p><strong>Attendance Rate:</strong> {
                  ((history.filter(item => item.present).length / history.length) * 100).toFixed(1)
                }%</p>
              </div>
            )}
          </section>
        </>
      )}

      {msg && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: msg.includes('Error') ? '#ffebee' : '#e3f2fd',
          border: `1px solid ${msg.includes('Error') ? '#f44336' : '#2196f3'}`,
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <strong>Message:</strong> {msg}
        </div>
      )}
    </div>
  );
}
