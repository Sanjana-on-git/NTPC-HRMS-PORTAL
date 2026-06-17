cat > ~/attendance-system/backend / controllers / deptHeadController.js << 'EOF'
const { getPool, sql } = require('../config/db');

const getPendingFiles = async (req, res) => {
  try {
    const dept = req.user.DeptName;
    const pool = getPool();
    const result = await pool.request()
      .input('Dept', sql.NVarChar, dept)
      .query(`SELECT Id, Empno, Dept, FileName, Status, Remarks, Upload_dt
              FROM FilesTable WHERE Dept = @Dept AND Status = 'Pending'
              ORDER BY Upload_dt ASC`);
    res.json({ pending: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending files' });
  }
};

const reviewFile = async (req, res) => {
  try {
    const { action, remarks } = req.body;
    if (!['Approved', 'Rejected'].includes(action))
      return res.status(400).json({ message: 'Action must be Approved or Rejected' });
    const dept = req.user.DeptName;
    const pool = getPool();
    const check = await pool.request()
      .input('Id', sql.Int, req.params.id)
      .input('Dept', sql.NVarChar, dept)
      .query(`SELECT Id FROM FilesTable WHERE Id = @Id AND Dept = @Dept AND Status = 'Pending'`);
    if (check.recordset.length === 0)
      return res.status(404).json({ message: 'File not found, already reviewed, or not in your department' });
    await pool.request()
      .input('Id', sql.Int, req.params.id)
      .input('Status', sql.NVarChar, action)
      .input('Remarks', sql.NVarChar, remarks || null)
      .input('Approved_by', sql.NVarChar, req.user.FullName)
      .query(`UPDATE FilesTable SET Status = @Status, Remarks = @Remarks,
              Approved_by = @Approved_by, Approved_dt = GETDATE() WHERE Id = @Id`);
    res.json({ message: `File ${action.toLowerCase()} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to review file' });
  }
};

const getApprovalHistory = async (req, res) => {
  try {
    const dept = req.user.DeptName;
    const pool = getPool();
    const result = await pool.request()
      .input('Dept', sql.NVarChar, dept)
      .input('Approved_by', sql.NVarChar, req.user.FullName)
      .query(`SELECT Id, Empno, Dept, FileName, Status, Remarks,
                     Upload_dt, Approved_by, Approved_dt
              FROM FilesTable WHERE Dept = @Dept AND Approved_by = @Approved_by
              ORDER BY Approved_dt DESC`);
    res.json({ history: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

const getAllDeptFiles = async (req, res) => {
  try {
    const dept = req.user.DeptName;
    const pool = getPool();
    const result = await pool.request()
      .input('Dept', sql.NVarChar, dept)
      .query(`SELECT Id, Empno, Dept, FileName, Status, Remarks,
                     Upload_dt, Approved_by, Approved_dt
              FROM FilesTable WHERE Dept = @Dept ORDER BY Upload_dt DESC`);
    res.json({ files: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch department files' });
  }
};

module.exports = { getPendingFiles, reviewFile, getApprovalHistory, getAllDeptFiles };
EOF