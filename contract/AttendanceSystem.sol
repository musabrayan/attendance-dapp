// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AttendanceSystem {
    address public teacher;
    address[] private studentList;
    mapping(address => bool) public isStudent;
    // date (YYYYMMDD) => student => present
    mapping(uint256 => mapping(address => bool)) public attendance;
    // student => list of dates present (for easy history retrieval)
    mapping(address => uint256[]) private attendanceDates;

    event StudentRegistered(address indexed student);
    event AttendanceMarked(uint256 indexed date, address indexed student, bool present);

    constructor() {
        teacher = msg.sender;
    }

    modifier onlyTeacher() {
        require(msg.sender == teacher, "Only teacher can perform this action");
        _;
    }

    function registerStudent(address _student) external onlyTeacher {
        require(_student != address(0), "Zero address");
        require(!isStudent[_student], "Already registered");
        isStudent[_student] = true;
        studentList.push(_student);
        emit StudentRegistered(_student);
    }

    // convenience: register many students
    function registerStudents(address[] calldata _students) external onlyTeacher {
        for (uint i = 0; i < _students.length; i++) {
            address s = _students[i];
            if (s != address(0) && !isStudent[s]) {
                isStudent[s] = true;
                studentList.push(s);
                emit StudentRegistered(s);
            }
        }
    }

    // mark attendance for a single student on a date (date format: YYYYMMDD, e.g., 20250915)
    function markAttendance(uint256 _date, address _student, bool _present) external onlyTeacher {
        require(isStudent[_student], "Not a registered student");
        attendance[_date][_student] = _present;
        if (_present) {
            attendanceDates[_student].push(_date);
        }
        emit AttendanceMarked(_date, _student, _present);
    }

    // view helpers
    function getStudentList() external view returns (address[] memory) {
        return studentList;
    }

    function getAttendanceDates(address _student) external view returns (uint256[] memory) {
        return attendanceDates[_student];
    }

    // optional convenience
    function checkAttendance(uint256 _date, address _student) external view returns (bool) {
        return attendance[_date][_student];
    }
}

