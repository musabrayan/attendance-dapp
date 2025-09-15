import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi/AttendanceSystem.json';
import TeacherPanel from './components/TeacherPanel';
import StudentPanel from './components/StudentPanel';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export default function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!window.ethereum) return;
    // auto-detect account changes
    window.ethereum.on && window.ethereum.on('accountsChanged', (accounts) => {
      setAccount(accounts[0] || null);
    });
  }, []);

  useEffect(() => {
    if (!window.ethereum || !account || !CONTRACT_ADDRESS) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const c = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    setContract(c);

    (async () => {
      try {
        const teacherAddress = await c.teacher();
        setIsTeacher(teacherAddress.toLowerCase() === account.toLowerCase());
        const s = await c.getStudentList();
        setStudents(s);
      } catch (err) {
        console.error('Contract load error', err);
      }
    })();
  }, [account]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  };

  return (
    <div className="app">
      <header>
        <h1>Attendance DApp</h1>
      </header>

      {!account ? (
        <div className="center">
          <button onClick={connectWallet}>Connect MetaMask</button>
          <p>(Use the account that deployed the contract as teacher)</p>
        </div>
      ) : (
        <div className="content">
          <p>Connected: <code>{account}</code></p>

          {!CONTRACT_ADDRESS ? (
            <p style={{color:'red'}}>Set VITE_CONTRACT_ADDRESS in .env.local</p>
          ) : !contract ? (
            <p>Loading contract...</p>
          ) : (
            <>
              {isTeacher ? (
                <TeacherPanel contract={contract} students={students} refreshStudents={async ()=> { const s = await contract.getStudentList(); setStudents(s); }} />
              ) : (
                <StudentPanel contract={contract} account={account} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
