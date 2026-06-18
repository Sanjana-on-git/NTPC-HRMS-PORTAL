const { getPool, sql } = require("../config/db");

const getApprovedFiles = async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT 
        Id,
        Empno,
        Dept,
        FileName,
        FilePath,
        Status,
        Remarks,
        Upload_dt,
        Approved_by,
        Approved_dt,
        sap_update,
        sap_update_dt
      FROM FilesTable
      WHERE Status = 'Approved_HOD'
      ORDER BY Approved_dt DESC
    `);

    res.status(200).json({
      files: result.recordset,
    });
  } catch (err) {
    console.error("Approved files fetch error:", err.message);
    res.status(500).json({
      message: "Failed to fetch approved files",
    });
  }
};

const markSapUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = getPool();

    const check = await pool
      .request()
      .input("Id", sql.Int, id)
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

    await pool
      .request()
      .input("Id", sql.Int, id)
      .query(`
        UPDATE FilesTable
        SET sap_update = 1,
            sap_update_dt = GETDATE(),
            Status = 'Completed_HR'
        WHERE Id = @Id
      `);

    res.status(200).json({
      message: "SAP update marked successfully and workflow completed",
    });
  } catch (err) {
    console.error("SAP update error:", err.message);
    res.status(500).json({
      message: "Failed to update SAP status",
    });
  }
};

module.exports = {
  getApprovedFiles,
  markSapUpdate,
};