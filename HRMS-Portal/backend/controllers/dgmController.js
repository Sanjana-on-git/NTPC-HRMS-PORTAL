const xlsx = require('xlsx');
const { getPool, sql } = require('../config/db');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { empno, dept } = req.body;
    if (!empno || !dept) return res.status(400).json({ message: 'Empno and Dept are required' });

    const pool = getPool();
    await pool.request()
      .input('Empno', sql.NVarChar, empno)
      .input('Dept', sql.NVarChar, dept)
      .input('FileName', sql.NVarChar, req.file.originalname)
      .input('FilePath', sql.NVarChar, req.file.path)
      .input('Status', sql.NVarChar, 'Pending')
      .query(`INSERT INTO FilesTable (Empno, Dept, FileName, FilePath, Status)
              VALUES (@Empno, @Dept, @FileName, @FilePath, @Status)`);

    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload file', error: err.message });
  }
};

const getUploadHistory = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query(`SELECT Id, Empno, Dept, FileName, Status, Remarks,
                     Upload_dt, Approved_by, Approved_dt,
                     sap_update, sap_update_dt
              FROM FilesTable
              ORDER BY Upload_dt DESC`);
    res.json({ history: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

const getFileStatus = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('Id', sql.Int, req.params.id)
      .query(`SELECT * FROM FilesTable WHERE Id = @Id`);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'File not found' });

    res.json({ file: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch file status' });
  }
};

module.exports = { uploadFile, getUploadHistory, getFileStatus };