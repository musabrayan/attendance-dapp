# Attendance DApp

A decentralized application for managing student attendance records on the Ethereum blockchain. This system allows teachers to register students and mark attendance, while students can view their attendance history.

## 📋 Features

### Teacher Panel
- **Student Registration**: Register individual students or bulk register multiple students
- **Attendance Management**: Mark students as present or absent for any date
- **Attendance Verification**: Check individual student attendance for specific dates
- **Student History**: View complete attendance history for any registered student
- **Student Management**: View all registered students and refresh the list

### Student Panel
- **Registration Status**: Check if you're registered as a student
- **Today's Attendance**: Quick check for today's attendance status
- **Date-Specific Check**: Check attendance for any specific date
- **Attendance History**: View complete attendance record with detailed status
- **Attendance Summary**: View statistics including attendance rate and total days

## 🏗️ Project Structure

```
attendance-dapp/
├── contract/
│   └── AttendanceSystem.sol          # Smart contract
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── abi/
│   │   │   └── AttendanceSystem.json # Contract ABI
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── StudentPanel.jsx      # Student interface
│   │   │   └── TeacherPanel.jsx      # Teacher interface
│   │   ├── App.css                   # Styling
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.css                 # Global styles
│   │   ├── main.jsx                  # App entry point
│   │   └── utils.js                  # Utility functions
│   ├── .env                          # Environment variables
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Access to an Ethereum network (local, testnet, or mainnet)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-dapp
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   npm install ethers@5
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the `frontend` directory:
   ```env
   VITE_CONTRACT_ADDRESS=your_deployed_contract_address
   ```

4. **Deploy the smart contract**
   
   Deploy [`AttendanceSystem.sol`](contract/AttendanceSystem.sol) to your chosen Ethereum network and update the contract address in your `.env.local` file.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to `http://localhost:5173` in your browser.

## 🔗 Smart Contract

The [`AttendanceSystem`](contract/AttendanceSystem.sol) contract includes:

### Core Functions
- `registerStudent(address _student)` - Register a single student (teacher only)
- `registerStudents(address[] _students)` - Register multiple students (teacher only)
- `markAttendance(uint256 _date, address _student, bool _present)` - Mark attendance (teacher only)
- `checkAttendance(uint256 _date, address _student)` - Check attendance for a date
- `getStudentList()` - Get all registered students
- `getAttendanceDates(address _student)` - Get all dates a student has attendance records
- `isStudent(address _student)` - Check if an address is a registered student

### Date Format
The contract uses `YYYYMMDD` format for dates (e.g., `20241225` for December 25, 2024).

## 🎯 Usage

### For Teachers

1. **Connect MetaMask** with the account that deployed the contract
2. **Register Students**:
   - Single registration: Enter student address and click "Register Student"
   - Bulk registration: Enter multiple addresses (one per line) and click "Register All Students"
3. **Mark Attendance**:
   - Select date and student
   - Click "Mark Present" or "Mark Absent"
4. **Check Records**:
   - Select student and date to check attendance
   - View complete attendance history for any student

### For Students

1. **Connect MetaMask** with your registered student account
2. **Check Registration**: Verify you're registered as a student
3. **View Attendance**:
   - Check today's attendance status
   - Check attendance for specific dates
   - Load complete attendance history with detailed status
   - View attendance statistics and summary

## 🛠️ Technical Details

### Frontend Stack
- **React 19.1.1** - UI framework
- **Vite** - Build tool and dev server
- **Ethers.js 5.8.0** - Ethereum library for blockchain interaction
- **CSS3** - Modern styling with dark theme and animations

### Key Components

- [`App.jsx`](frontend/src/App.jsx) - Main application component with wallet connection
- [`TeacherPanel.jsx`](frontend/src/components/TeacherPanel.jsx) - Teacher interface
- [`StudentPanel.jsx`](frontend/src/components/StudentPanel.jsx) - Student interface
- [`utils.js`](frontend/src/utils.js) - Date conversion utilities

### Utility Functions

The [`utils.js`](frontend/src/utils.js) file contains:
- `dateToNumber(dateStr)` - Converts "YYYY-MM-DD" to YYYYMMDD number
- `formatDateNumber(num)` - Converts YYYYMMDD number back to "YYYY-MM-DD"

## 📦 Build and Deployment

### Development
```bash
npm run dev        # Start development server
```

### Production
```bash
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🔧 Configuration

### Environment Variables
- `VITE_CONTRACT_ADDRESS` - The deployed contract address

