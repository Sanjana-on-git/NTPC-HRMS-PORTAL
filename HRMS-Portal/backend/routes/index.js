const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorise } = require('../middleware/auth');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${ts}_${safe}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.xlsx', '.xls', '.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only Excel/CSV files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
});

const authCtrl = require('../controllers/authController');
const dgmCtrl = require('../controllers/dgmController');
const deptCtrl = require('../controllers/deptHeadController');
const hrCtrl = require('../controllers/hrController');

const router = express.Router();

// Auth
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', authenticate, authCtrl.getMe);
router.put('/auth/change-password', authenticate, authCtrl.changePassword);

// DGM
router.post('/dgm/upload', authenticate, authorise('DGM'), upload.single('file'), dgmCtrl.uploadFile);
router.get('/dgm/history', authenticate, authorise('DGM'), dgmCtrl.getUploadHistory);
router.get('/dgm/status/:id', authenticate, authorise('DGM'), dgmCtrl.getFileStatus);

// DeptHead
router.get('/depthead/pending', authenticate, authorise('DeptHead'), deptCtrl.getPendingFiles);
router.post('/depthead/review/:id', authenticate, authorise('DeptHead'), deptCtrl.reviewFile);
router.get('/depthead/history', authenticate, authorise('DeptHead'), deptCtrl.getApprovalHistory);

// HR
router.get('/hr/approved-files', authenticate, authorise('HR'), hrCtrl.getApprovedFiles);
router.patch('/hr/sap-update/:id', authenticate, authorise('HR'), hrCtrl.markSapUpdate);
router.get('/hr/export', authenticate, authorise('HR'), hrCtrl.exportReport);
router.get('/hr/users', authenticate, authorise('HR'), hrCtrl.getUsers);
router.post('/hr/users', authenticate, authorise('HR'), hrCtrl.createUser);
router.patch('/hr/users/:id/toggle', authenticate, authorise('HR'), hrCtrl.toggleUser);

module.exports = router;