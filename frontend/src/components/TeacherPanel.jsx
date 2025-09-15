import React, { useState } from 'react';
import { dateToNumber, formatDateNumber } from '../utils';

export default function TeacherPanel({ contract, students, refreshStudents }) {
  const [newStudent, setNewStudent] = useState('');
  const [bulkStudents, setBulkStudents] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [checkDate, setCheckDate] = useState(new Date().toISOString().slice(0,10));
  const [checkStudent, setCheckStudent] = useState('');
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [studentDates, setStudentDates] = useState([]);
  const [status, setStatus] = useState('');

  const register = async () => {
    try {
      setStatus('Sending transaction...');
      const tx = await contract.registerStudent(newStudent);
      await tx.wait();
      setStatus('Registered successfully');
      setNewStudent('');
      await refreshStudents();
    } catch (e) {
      setStatus('Error: ' + (e?.error?.message || e.message));
    }
  };

  const registerBulk = async () => {
    try {
      const addresses = bulkStudents.split('\n').map(addr => addr.trim()).filter(addr => addr);
      if (addresses.length === 0) return setStatus('Please enter student addresses');
      
      setStatus('Sending transaction...');
      const tx = await contract.registerStudents(addresses);
      await tx.wait();
      setStatus(`Registered ${addresses.length} students successfully`);
      setBulkStudents('');
      await refreshStudents();
    } catch (e) {
      setStatus('Error: ' + (e?.error?.message || e.message));
    }
  };

  const markPresent = async () => {
    if (!selectedStudent) return setStatus('Select a student');
    try {
      const dateNum = dateToNumber(date);
      setStatus('Sending transaction...');
      const tx = await contract.markAttendance(dateNum, selectedStudent, true);
      await tx.wait();
      setStatus('Attendance marked as Present');
    } catch (e) {
      setStatus('Error: ' + (e?.error?.message || e.message));
    }
  };

  const markAbsent = async () => {
    if (!selectedStudent) return setStatus('Select a student');
    try {
      const dateNum = dateToNumber(date);
      setStatus('Sending transaction...');
      const tx = await contract.markAttendance(dateNum, selectedStudent, false);
      await tx.wait();
      setStatus('Attendance marked as Absent');
    } catch (e) {
      setStatus('Error: ' + (e?.error?.message || e.message));
    }
  };

  const checkStudentAttendance = async () => {
    if (!checkStudent) return setStatus('Select a student to check');
    try {
      const dateNum = dateToNumber(checkDate);
      const result = await contract.checkAttendance(dateNum, checkStudent);
      setAttendanceResult(result);
      setStatus('');
    } catch (e) {
      setStatus('Error: ' + (e?.error?.message || e.message));
      setAttendanceResult(null);
    }
  };

  const getStudentDates = async () => {
    if (!checkStudent) return setStatus('Select a student');
    try {
      const dates = await contract.getAttendanceDates(checkStudent);
      setStudentDates(dates.map(d => d.toString()));
      setStatus('');
    } catch (e) {
      setStatus('Error: ' + (e?.error?.message || e.message));
      setStudentDates([]);
    }
  };

  const checkStudentStatus = async () => {
    if (!checkStudent) return setStatus('Enter student address');
    try {
      const isRegistered = await contract.isStudent(checkStudent);
      setStatus(`Student ${checkStudent} is ${isRegistered ? 'registered' : 'not registered'}`);
    } catch (e) {
      setStatus('Error: ' + (e?.error?.message || e.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Teacher Panel</h2>

      <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Register Single Student</h3>
        <input 
          value={newStudent} 
          onChange={(e)=>setNewStudent(e.target.value)} 
          placeholder="0x..." 
          style={{ marginRight: '10px', width: '400px' }}
        />
        <button onClick={register}>Register Student</button>
      </section>

      <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Register Multiple Students</h3>
        <textarea 
          value={bulkStudents}
          onChange={(e)=>setBulkStudents(e.target.value)}
          placeholder="Enter student addresses, one per line&#10;0x...&#10;0x...&#10;0x..."
          rows={5}
          style={{ width: '400px', marginRight: '10px' }}
        />
        <br />
        <button onClick={registerBulk} style={{ marginTop: '10px' }}>Register All Students</button>
      </section>

      <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Mark Attendance</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Date:
            <input 
              type="date" 
              value={date} 
              onChange={(e)=>setDate(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Student:
            <select 
              value={selectedStudent} 
              onChange={(e)=>setSelectedStudent(e.target.value)}
              style={{ marginLeft: '10px', width: '400px' }}
            >
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <button onClick={markPresent} style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}>
          Mark Present
        </button>
        <button onClick={markAbsent} style={{ backgroundColor: 'red', color: 'white' }}>
          Mark Absent
        </button>
      </section>

      <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Check Student Attendance</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Date:
            <input 
              type="date" 
              value={checkDate} 
              onChange={(e)=>setCheckDate(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Student:
            <select 
              value={checkStudent} 
              onChange={(e)=>setCheckStudent(e.target.value)}
              style={{ marginLeft: '10px', width: '400px' }}
            >
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <button onClick={checkStudentAttendance} style={{ marginRight: '10px' }}>
          Check Attendance
        </button>
        <button onClick={checkStudentStatus}>Check Registration Status</button>

        {attendanceResult !== null && (
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
            Attendance on {checkDate}: {attendanceResult ? 'Present' : 'Absent'}
          </p>
        )}
      </section>

      <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Student Attendance History</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Student:
            <select 
              value={checkStudent} 
              onChange={(e)=>setCheckStudent(e.target.value)}
              style={{ marginLeft: '10px', width: '400px' }}
            >
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <button onClick={getStudentDates}>Get Attendance Dates</button>

        {studentDates.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h4>Attendance recorded on these dates:</h4>
            <ul>
              {studentDates.map(d => (
                <li key={d}>{formatDateNumber(d)}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>All Registered Students ({students.length})</h3>
        <button onClick={refreshStudents} style={{ marginBottom: '10px' }}>Refresh Student List</button>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
          {students.length > 0 ? (
            <ul style={{ margin: 0 }}>
              {students.map(s => <li key={s} style={{ marginBottom: '5px' }}>{s}</li>)}
            </ul>
          ) : (
            <p>No students registered yet.</p>
          )}
        </div>
      </section>

      {status && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: status.includes('Error') ? '#ffebee' : '#e8f5e8',
          border: `1px solid ${status.includes('Error') ? '#f44336' : '#4caf50'}`,
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <strong>Status:</strong> {status}
        </div>
      )}
    </div>
  );
}
