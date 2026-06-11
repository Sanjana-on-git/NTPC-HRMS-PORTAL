const xlsx = require('xlsx');
const { getPool, sql } = require('../config/db');

const getApprovedFiles = async (req, res) => {
  try {
    const { dept } = req.query;
    const pool = getPool();
    let query = `SELECT Id, Empno, Dept, FileName, Status, Remarks,
                        Upload_dt, Approved_by, Approved_dt,
                        sap_update, sap_update_dt
                 FROM FilesTable WHERE Status = 'Approved'`;
    const request = pool.request();
    if (dept) { query += ' AND Dept = @Dept'; request.input('Dept', sql.NVarChar, dept); }
    query += ' ORDER BY Approved_dt DESC';
    const result = await request.query(query);
    res.json({ files: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch approved files' });
  }
};

const markSapUpdate = async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input('Id', sql.Int, req.params.id)
      .query(`UPDATE FilesTable
              SET sap_update = 1, sap_update_dt = GETDATE()
              WHERE Id = @Id AND Status = 'Approved'`);
    res.json({ message: 'SAP update marked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark SAP update' });
  }
};

const exportReport = async (req, res) => {
  try {
    const { dept } = req.query;
    const pool = getPool();
    const request = pool.request();
    let where = "WHERE Status = 'Approved'";
    if (dept) { where += ' AND Dept = @Dept'; request.input('Dept', sql.NVarChar, dept); }
    const result = await request.query(`SELECT * FROM FilesTable ${where} ORDER BY Dept, Upload_dt`);

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(result.recordset);
    xlsx.utils.book_append_sheet(wb, ws, 'Files');
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const filename = `files_report_${Date.now()}.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
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
  getApprovedFiles, markSapUpdate, exportReport,
  getUsers, createUser, toggleUser,
};