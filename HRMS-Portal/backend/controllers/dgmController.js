const { getPool, sql } = require("../config/db");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const empno = req.user.EmployeeCode;
    const dept = req.user.DeptName;

    if (!empno || !dept) {
      return res.status(400).json({
        message: "Employee number and department are required",
      });
    }

    const pool = getPool();

    await pool
      .request()
      .input("Empno", sql.NVarChar, empno)
      .input("Dept", sql.NVarChar, dept)
      .input("FileName", sql.NVarChar, req.file.originalname)
      .input("FilePath", sql.NVarChar, req.file.path)
      .input("Status", sql.NVarChar, "Pending_HOD")
      .query(`
        INSERT INTO FilesTable 
        (Empno, Dept, FileName, FilePath, Status, Upload_dt)
        VALUES 
        (@Empno, @Dept, @FileName, @FilePath, @Status, GETDATE())
      `);

    res.status(201).json({
      message: "File uploaded successfully and sent to HOD for approval",
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({
      message: "Failed to upload file",
    });
  }
};

const getUploadHistory = async (req, res) => {
  try {
    const dept = req.user.DeptName;

    const pool = getPool();

    const result = await pool
      .request()
      .input("Dept", sql.NVarChar, dept)
      .query(`
        SELECT 
          Id,
          Empno,
          Dept,
          FileName,
          Status,
          Remarks,
          Upload_dt,
          Approved_by,
          Approved_dt,
          sap_update,
          sap_update_dt
        FROM FilesTable
        WHERE Dept = @Dept
        ORDER BY Upload_dt DESC
      `);

    res.status(200).json({
      history: result.recordset,
    });
  } catch (err) {
    console.error("History fetch error:", err.message);
    res.status(500).json({
      message: "Failed to fetch history",
    });
  }
};

const getFileStatus = async (req, res) => {
  try {
    const dept = req.user.DeptName;

    const pool = getPool();

    const result = await pool
      .request()
      .input("Id", sql.Int, req.params.id)
      .input("Dept", sql.NVarChar, dept)
      .query(`
        SELECT *
        FROM FilesTable
        WHERE Id = @Id AND Dept = @Dept
      `);

    if (!result.recordset.length) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.status(200).json({
      file: result.recordset[0],
    });
  } catch (err) {
    console.error("Status fetch error:", err.message);
    res.status(500).json({
      message: "Failed to fetch file status",
    });
  }
};

module.exports = {
  uploadFile,
  getUploadHistory,
  getFileStatus,
};