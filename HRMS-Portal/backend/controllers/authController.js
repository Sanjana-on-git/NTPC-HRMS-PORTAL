const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../config/db');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Employee code and password are required',
      });
    }

    const pool = getPool();

    const result = await pool
      .request()
      .input('EmployeeCode', sql.NVarChar, email.trim())
      .query(`
        SELECT 
          u.UserID,
          u.EmployeeCode,
          u.FullName,
          u.Email,
          u.Password,
          u.Role,
          u.DeptID,
          u.IsActive,
          d.DeptName
        FROM Users u
        LEFT JOIN Departments d ON u.DeptID = d.DeptID
        WHERE u.EmployeeCode = @EmployeeCode
      `);

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    if (!user.IsActive) {
      return res.status(403).json({
        message: 'Account deactivated. Contact HR.',
      });
    }

    const match = password === user.Password;

    if (!match) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

const token = jwt.sign(
  {
    userId: user.UserID,
    role: user.Role,
    deptId: user.DeptID,
    deptName: user.DeptName,
    fullName: user.FullName,
    employeeCode: user.EmployeeCode,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  }
);
    const { Password, ...userSafe } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userSafe,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({
      message: 'Server error during login',
    });
  }
};

const getMe = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool
      .request()
      .input('UserID', sql.Int, req.user.userId)
      .query(`
        SELECT 
          u.UserID,
          u.EmployeeCode,
          u.FullName,
          u.Email,
          u.Role,
          u.DeptID,
          d.DeptName
        FROM Users u
        LEFT JOIN Departments d ON u.DeptID = d.DeptID
        WHERE u.UserID = @UserID
      `);

    res.status(200).json({
      user: result.recordset[0],
    });
  } catch (err) {
    console.error('GetMe error:', err.message);
    res.status(500).json({
      message: 'Server error',
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Both passwords are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters',
      });
    }

    const pool = getPool();

    const result = await pool
      .request()
      .input('UserID', sql.Int, req.user.userId)
      .query(`
        SELECT Password 
        FROM Users 
        WHERE UserID = @UserID
      `);

    if (!result.recordset.length) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const match = await bcrypt.compare(
      currentPassword,
      result.recordset[0].Password
    );

    if (!match) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool
      .request()
      .input('UserID', sql.Int, req.user.userId)
      .input('Password', sql.NVarChar, newHash)
      .query(`
        UPDATE Users
        SET Password = @Password,
            UpdatedAt = GETDATE()
        WHERE UserID = @UserID
      `);

    res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error('ChangePassword error:', err.message);
    res.status(500).json({
      message: 'Server error',
    });
  }
};

module.exports = {
  login,
  getMe,
  changePassword,
};