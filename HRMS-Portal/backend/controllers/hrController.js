cat > ~/attendance-system/backend / controllers / hrController.js << 'EOF'
const { getPool, sql } = require('../config/db');
const bcrypt = require('bcryptjs');

const getAllApprovedFiles = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query(`SELECT Id, Empno, Dept, FileName, Status, Remarks,
                     Upload_dt, Approved_by, Approved_dt, sap_update, sap_update_dt
              FROM FilesTable WHERE Status = 'Approved' ORDER BY Approved_dt DESC`);
    res.json({ files: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch approved files' });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const { dept, status } = req.query;
    const pool = getPool();
    let query = `SELECT Id, Empno, Dept, FileName, Status, Remarks,
                        Upload_dt, Approved_by, Approved_dt, sap_update, sap_update_dt
                 FROM FilesTable WHERE 1=1`;
    const request = pool.request();
    if (dept) { query += ' AND Dept = @Dept'; request.input('Dept', sql.NVarChar, dept); }
    if (status) { query += ' AND Status = @Status'; request.input('Status', sql.NVarChar, status); }
    query += ' ORDER BY Upload_dt DESC';
    const result = await request.query(query);
    res.json({ files: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch files' });
  }
};

const markSapUpdate = async (req, res) => {
  try {
    const pool = getPool();
    const check = await pool.request()
      .input('Id', sql.Int, req.params.id)
      .query(`SELECT Id FROM FilesTable WHERE Id = @Id AND Status = 'Approved'`);
    if (check.recordset.length === 0)
      return res.status(404).json({ message: 'File not found or not approved yet' });
    await pool.request()
      .input('Id', sql.Int, req.params.id)
      .query(`UPDATE FilesTable SET sap_update = 1, sap_update_dt = GETDATE() WHERE Id = @Id`);
    res.json({ message: 'SAP update marked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark SAP update' });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query(`SELECT u.UserID, u.EmployeeCode, u.FullName, u.Email, u.Role,
                     u.IsActive, u.DateOfBirth, u.CreatedAt, d.DeptName
              FROM Users u LEFT JOIN Departments d ON u.DeptID = d.DeptID
              ORDER BY u.Role, u.FullName`);
    res.json({ employees: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { employeeCode, fullName, email, role, deptId, dateOfBirth } = req.body;
    if (!/^\d{6}$/.test(employeeCode))
      return res.status(400).json({ message: 'Employee code must be exactly 6 digits' });
    const dob = new Date(dateOfBirth);
    const dd = String(dob.getDate()).padStart(2, '0');
    const mm = String(dob.getMonth() + 1).padStart(2, '0');
    const yyyy = dob.getFullYear();
    const initialPassword = `${dd}${mm}${yyyy}`;
    const hashedPassword = await bcrypt.hash(initialPassword, 10);
    const pool = getPool();
    await pool.request()
      .input('EmployeeCode', sql.NVarChar, employeeCode)
      .input('FullName', sql.NVarChar, fullName)
      .input('Email', sql.NVarChar, email)
      .input('Password', sql.NVarChar, hashedPassword)
      .input('Role', sql.NVarChar, role)
      .input('DeptID', sql.Int, deptId)
      .input('DateOfBirth', sql.Date, dateOfBirth)
      .query(`INSERT INTO Users (EmployeeCode, FullName, Email, Password, Role, DeptID, DateOfBirth, IsActive)
              VALUES (@EmployeeCode, @FullName, @Email, @Password, @Role, @DeptID, @DateOfBirth, 1)`);
    res.status(201).json({ message: 'Employee created successfully', initialPassword });
  } catch (err) {
    if (err.message.includes('UNIQUE') || err.message.includes('duplicate'))
      return res.status(400).json({ message: 'Employee code or email already exists' });
    res.status(500).json({ message: 'Failed to create employee', error: err.message });
  }
};

const deactivateEmployee = async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input('UserID', sql.Int, req.params.id)
      .query(`UPDATE Users SET IsActive = 0 WHERE UserID = @UserID`);
    res.json({ message: 'Employee deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to deactivate employee' });
  }
};

module.exports = { getAllApprovedFiles, getAllFiles, markSapUpdate, getAllEmployees, createEmployee, deactivateEmployee };
EOF