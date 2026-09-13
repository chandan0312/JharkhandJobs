import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/resumes';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents (.doc, .docx) are allowed!'), false);
  }
};

export const uploadResume = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Ensure notification upload directory exists
const notificationDir = 'uploads/notifications';
if (!fs.existsSync(notificationDir)) {
  fs.mkdirSync(notificationDir, { recursive: true });
}

const notificationStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, notificationDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'notification-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const notificationFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Allowed formats: PDF, Word documents, or Images (.pdf, .doc, .docx, .jpg, .jpeg, .png)'), false);
  }
};

export const uploadNotificationDoc = multer({
  storage: notificationStorage,
  fileFilter: notificationFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
