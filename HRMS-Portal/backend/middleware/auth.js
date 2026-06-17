const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const pool = getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, decoded.userId)
      .query(`SELECT UserID, EmployeeCode, FullName, Email, Role, DeptID, IsActive
              FROM Users WHERE UserID = @UserID AND IsActive = 1`);

    if (result.recordset.length === 0)
      return res.status(401).json({ message: 'Account not found or deactivated' });

    req.user = result.recordset[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Session expired, please login again' });
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorise = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.Role))
    return res.status(403).json({ message: `Access denied. Required: ${roles.join(' or ')}` });
  next();
};

module.exports = { authenticate, authorise };

