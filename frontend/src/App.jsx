import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi/AttendanceSystem.json';
import TeacherPanel from './components/TeacherPanel';
import StudentPanel from './components/StudentPanel';

// Get contract address from environment variable
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export default function App() {
  // React state variables
  const [account, setAccount] = useState(null);      // currently connected wallet address
  const [contract, setContract] = useState(null);    // contract instance
  const [isTeacher, setIsTeacher] = useState(false); // check if connected account is teacher
  const [students, setStudents] = useState([]);      // list of registered students

  // Detect account changes (MetaMask) and update state
  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on &&
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
  }, []);

  // Load contract whenever account changes
  useEffect(() => {
    if (!window.ethereum || !account || !CONTRACT_ADDRESS) return;

    // Create a provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Connect to deployed smart contract
    const c = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    setContract(c);

    // Fetch teacher address and student list from contract
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

  // Function to connect MetaMask wallet
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

      {/* If no account connected, show connect button */}
      {!account ? (
        <div className="center">
          <button onClick={connectWallet}>Connect MetaMask</button>
          <p>(Use the account that deployed the contract as teacher)</p>
        </div>
      ) : (
        <div className="content">
          {/* Show connected account address */}
          <p>
            Connected: <code>{account}</code>
          </p>

          {/* Check if contract address is set and contract is loaded */}
          {!CONTRACT_ADDRESS ? (
            <p style={{ color: 'red' }}>Set VITE_CONTRACT_ADDRESS in .env.local</p>
          ) : !contract ? (
            <p>Loading contract...</p>
          ) : (
            <>
              {/* If teacher, show TeacherPanel else show StudentPanel */}
              {isTeacher ? (
                <TeacherPanel
                  contract={contract}
                  students={students}
                  refreshStudents={async () => {
                    const s = await contract.getStudentList();
                    setStudents(s);
                  }}
                />
              ) : (
                <StudentPanel contract={contract} account={account} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
