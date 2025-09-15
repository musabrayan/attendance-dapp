import React, { useState } from 'react';
import { dateToNumber, formatDateNumber } from '../utils';

export default function StudentPanel({ contract, account }) {
  const [todayPresent, setTodayPresent] = useState(null);
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState('');

  const checkToday = async () => {
    try {
      const today = new Date().toISOString().slice(0,10);
      const dateNum = dateToNumber(today);
      const present = await contract.checkAttendance(dateNum, account);
      setTodayPresent(present);
    } catch (e) {
      setMsg('Error: ' + (e?.error?.message || e.message));
    }
  };

  const loadHistory = async () => {
    try {
      const dates = await contract.getAttendanceDates(account);
      // dates are BigNumber; convert to string
      setHistory(dates.map(d => d.toString()).reverse());
    } catch (e) {
      setMsg('Error: ' + (e?.error?.message || e.message));
    }
  };

  return (
    <div>
      <h2>Student Panel</h2>
      <p>Your address: <code>{account}</code></p>

      <button onClick={checkToday}>Check Today's Attendance</button>
      {todayPresent !== null && <p>Present today? <strong>{todayPresent ? 'Yes' : 'No'}</strong></p>}

      <hr/>

      <button onClick={loadHistory}>Load Attendance History</button>
      <ul>
        {history.map(d => <li key={d}>{formatDateNumber(d)}</li>)}
      </ul>

      <p>{msg}</p>
    </div>
  );
}
