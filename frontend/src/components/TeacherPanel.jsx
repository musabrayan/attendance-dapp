import React, { useState } from 'react';
import { dateToNumber, formatDateNumber } from '../utils';

export default function TeacherPanel({ contract, students, refreshStudents }) {
  const [newStudent, setNewStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
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

  const markPresent = async () => {
    if (!selectedStudent) return setStatus('Select a student');
    try {
      const dateNum = dateToNumber(date);
      setStatus('Sending transaction...');
      const tx = await contract.markAttendance(dateNum, selectedStudent, true);
      await tx.wait();
      setStatus('Attendance marked');
    } catch (e) {
      setStatus('Error: ' + (e?.error?.message || e.message));
    }
  };

  return (
    <div>
      <h2>Teacher Panel</h2>

      <section>
        <h3>Register student (address)</h3>
        <input value={newStudent} onChange={(e)=>setNewStudent(e.target.value)} placeholder="0x..." />
        <button onClick={register}>Register</button>
      </section>

      <section>
        <h3>Mark attendance</h3>
        <label>
          Date
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
        </label>

        <label>
          Student
          <select value={selectedStudent} onChange={(e)=>setSelectedStudent(e.target.value)}>
            <option value="">-- choose --</option>
            {students.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <button onClick={markPresent}>Mark Present</button>
      </section>

      <p>{status}</p>
    </div>
  );
}
