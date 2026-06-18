const { getPool, sql } = require("../config/db");

const getPendingFiles = async (req, res) => {
  try {
    const deptId = req.user.DeptID;

    console.log("Logged in user:", req.user);
    console.log("DeptID:", deptId);

    const pool = getPool();

    const result = await pool
      .request()
      .input("DeptID", sql.Int, deptId)
      .query(`
        SELECT
          Id,
          Empno,
          Dept,
          FileName,
          FilePath,
          Status,
          Upload_dt
        FROM FilesTable
        WHERE Dept = (
          SELECT DeptName
          FROM Departments
          WHERE DeptID = @DeptID
        )
        AND Status = 'Pending_HOD'
        ORDER BY Upload_dt DESC
      `);

    console.log("Pending files:", result.recordset);

    res.status(200).json({
      pending: result.recordset,
    });
  } catch (err) {
    console.error("Pending fetch error:", err.message);
    res.status(500).json({
      message: "Failed to fetch pending files",
    });
  }
};

const reviewFile = async (req, res) => {
  try {
    const { action } = req.body;
    const approvedBy = req.user.FullName;
    const fileId = req.params.id;

    if (!["Approved", "Rejected"].includes(action)) {
      return res.status(400).json({
        message: "Invalid action",
      });
    }

    const pool = getPool();

    const check = await pool
      .request()
      .input("Id", sql.Int, fileId)
      .query(`
        SELECT Id, Status
        FROM FilesTable
        WHERE Id = @Id
      `);

    if (!check.recordset.length) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const updatedStatus =
      action === "Approved" ? "Approved_HOD" : "Rejected_HOD";

    await pool
      .request()
      .input("Id", sql.Int, fileId)
      .input("Status", sql.NVarChar, updatedStatus)
      .input("Approved_by", sql.NVarChar, approvedBy)
      .query(`
        UPDATE FilesTable
        SET Status = @Status,
            Approved_by = @Approved_by,
            Approved_dt = GETDATE()
        WHERE Id = @Id
      `);

    res.status(200).json({
      message: `File ${action.toLowerCase()} successfully`,
    });
  } catch (err) {
    console.error("Review error:", err.message);
    res.status(500).json({
      message: "Failed to review file",
    });
  }
};

module.exports = {
  getPendingFiles,
  reviewFile,
};