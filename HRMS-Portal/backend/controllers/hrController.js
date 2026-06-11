const xlsx = require('xlsx');
const { getPool, sql } = require('../config/db');

const getApprovedFiles = async (req, res) => {
  try {
    const { month, deptId } = req.query;
    const pool = getPool();
    let query = `SELECT s.SheetID, s.AttendanceMonth, s.FileName, s.TotalRows,
                        s.Status, s.UploadedAt, s.ReviewedAt,
                        d.DeptName, d.DeptID,
                        uploader.FullName AS UploadedByName,
                        reviewer.FullName AS ReviewedByName
                 FROM AttendanceSheets s
                 JOIN Departments d ON s.DeptID = d.DeptID
                 JOIN Users uploader ON s.UploadedBy = uploader.UserID
                 LEFT JOIN Users reviewer ON s.ReviewedBy = reviewer.UserID
                 WHERE s.Status = 'Approved'`;
    const request = pool.request();
    if (month) { query += ' AND s.AttendanceMonth = @Month'; request.input('Month', sql.NVarChar, month); }
    if (deptId) { query += ' AND s.DeptID = @DeptID'; request.input('DeptID', sql.Int, deptId); }
    query += ' ORDER BY s.ReviewedAt DESC';
    const result = await request.query(query);
    res.json({ files: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch approved files' });
  }
};

const getAttendanceRecords = async (req, res) => {
  try {
    const { month, deptId, employeeCode } = req.query;
    const pool = getPool();
    let query = `SELECT ar.RecordID, ar.EmployeeCode, u.FullName, ar.AttendanceDate,
                        ar.Status, ar.OTHours, ar.Remarks,
                        d.DeptName, s.AttendanceMonth
                 FROM AttendanceRecords ar
                 JOIN AttendanceSheets s ON ar.SheetID = s.SheetID
                 JOIN Departments d ON s.DeptID = d.DeptID
                 LEFT JOIN Users u ON ar.UserID = u.UserID
                 WHERE s.Status = 'Approved'`;
    const request = pool.request();
    if (month) { query += ' AND s.AttendanceMonth = @Month'; request.input('Month', sql.NVarChar, month); }
    if (deptId) { query += ' AND s.DeptID = @DeptID'; request.input('DeptID', sql.Int, deptId); }
    if (employeeCode) { query += ' AND ar.EmployeeCode = @EmpCode'; request.input('EmpCode', sql.NVarChar, employeeCode); }
    query += ' ORDER BY ar.AttendanceDate, ar.EmployeeCode';
    const result = await request.query(query);
    res.json({ records: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records' });
  }
};

const getSummaryReport = async (req, res) => {
  try {
    const { month, deptId } = req.query;
    const pool = getPool();
    const request = pool.request();
    let where = "WHERE s.Status = 'Approved'";
    if (month) { where += ' AND s.AttendanceMonth = @Month'; request.input('Month', sql.NVarChar, month); }
    if (deptId) { where += ' AND s.DeptID = @DeptID'; request.input('DeptID', sql.Int, deptId); }
    const result = await request.query(`
      SELECT ar.EmployeeCode, u.FullName, d.DeptName,
             COUNT(CASE WHEN ar.Status = 'P'  THEN 1 END) AS PresentDays,
             COUNT(CASE WHEN ar.Status = 'A'  THEN 1 END) AS AbsentDays,
             COUNT(CASE WHEN ar.Status = 'HD' THEN 1 END) AS HalfDays,
             COUNT(CASE WHEN ar.Status = 'L'  THEN 1 END) AS LeaveDays,
             SUM(ISNULL(ar.OTHours, 0))                   AS TotalOTHours
      FROM AttendanceRecords ar
      JOIN AttendanceSheets s ON ar.SheetID = s.SheetID
      JOIN Departments d ON s.DeptID = d.DeptID
      LEFT JOIN Users u ON ar.UserID = u.UserID
      ${where}
      GROUP BY ar.EmployeeCode, u.FullName, d.DeptName
      ORDER BY d.DeptName, ar.EmployeeCode
    `);
    res.json({ summary: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate summary' });
  }
};

const exportReport = async (req, res) => {
  try {
    const { format = 'excel', month, deptId } = req.query;
    const pool = getPool();
    const request = pool.request();
    let where = "WHERE s.Status = 'Approved'";
    if (month) { where += ' AND s.AttendanceMonth = @Month'; request.input('Month', sql.NVarChar, month); }
    if (deptId) { where += ' AND s.DeptID = @DeptID'; request.input('DeptID', sql.Int, deptId); }
    const result = await request.query(`
      SELECT ar.EmployeeCode, ISNULL(u.FullName,'') AS EmployeeName,
             d.DeptName AS Department, s.AttendanceMonth AS Month,
             ar.AttendanceDate, ar.Status, ar.OTHours, ar.Remarks
      FROM AttendanceRecords ar
      JOIN AttendanceSheets s ON ar.SheetID = s.SheetID
      JOIN Departments d ON s.DeptID = d.DeptID
      LEFT JOIN Users u ON ar.UserID = u.UserID
      ${where}
      ORDER BY d.DeptName, ar.EmployeeCode, ar.AttendanceDate
    `);
    if (format === 'excel') {
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(result.recordset);
      xlsx.utils.book_append_sheet(wb, ws, 'Attendance');
      const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
      const filename = `attendance_${month || 'all'}_${Date.now()}.xlsx`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } else {
      res.json({ data: result.recordset });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to export' });
  }
};

const getUsers = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query(`SELECT u.UserID, u.EmployeeCode, u.FullName, u.Email,
                     u.Role, u.IsActive, u.CreatedAt, d.DeptName
              FROM Users u
              LEFT JOIN Departments d ON u.DeptID = d.DeptID
              ORDER BY u.Role, u.FullName`);
    res.json({ users: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const createUser = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { employeeCode, fullName, email, role, deptId, password } = req.body;
    if (!employeeCode || !fullName || !email || !role || !password)
      return res.status(400).json({ message: 'All fields are required' });
    const hash = await bcrypt.hash(password, 10);
    const pool = getPool();
    await pool.request()
      .input('EmployeeCode', sql.NVarChar, employeeCode)
      .input('FullName', sql.NVarChar, fullName)
      .input('Email', sql.NVarChar, email.toLowerCase())
      .input('Password', sql.NVarChar, hash)
      .input('Role', sql.NVarChar, role)
      .input('DeptID', sql.Int, deptId || null)
      .query(`INSERT INTO Users (EmployeeCode, FullName, Email, Password, Role, DeptID)
              VALUES (@EmployeeCode, @FullName, @Email, @Password, @Role, @DeptID)`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.number === 2627)
      return res.status(400).json({ message: 'Employee code or email already exists' });
    res.status(500).json({ message: 'Failed to create user' });
  }
};

const toggleUser = async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input('UserID', sql.Int, req.params.id)
      .query(`UPDATE Users SET IsActive = 1 - IsActive WHERE UserID = @UserID`);
    res.json({ message: 'User status toggled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle user' });
  }
};

module.exports = {
  getApprovedFiles, getAttendanceRecords, getSummaryReport,
  exportReport, getUsers, createUser, toggleUser,
};
