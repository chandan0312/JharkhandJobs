// ---------------------------------------------------------------------------
// /api/upload — File & Document upload endpoint (Admin only)
// ---------------------------------------------------------------------------

import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { authRequired } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

// Upload storage directory
const uploadDir = path.resolve(__dirname, '../../uploads/docs')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf'
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`
    cb(null, `${baseName}-${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`Only document & PDF files (${allowed.join(', ')}) are permitted.`))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 35 * 1024 * 1024, // 35 MB max file size
  },
})

/**
 * POST /api/upload/pdf
 * Upload official notification PDF, admit card instructions, syllabus, or merit list.
 */
router.post('/pdf', authRequired, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Please attach a valid PDF document.' })
  }

  // Construct access URL
  const fileUrl = `/uploads/docs/${req.file.filename}`

  res.status(201).json({
    success: true,
    url: fileUrl,
    filename: req.file.originalname,
    storedFilename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  })
})

// ---------------------------------------------------------------------------
// Image Upload for Blog & Notification Descriptions
// ---------------------------------------------------------------------------
const imageUploadDir = path.resolve(__dirname, '../../uploads/images')
if (!fs.existsSync(imageUploadDir)) {
  fs.mkdirSync(imageUploadDir, { recursive: true })
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageUploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`
    cb(null, `img-${baseName}-${uniqueSuffix}${ext}`)
  },
})

const imageFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`Only image files (${allowed.join(', ')}) are permitted.`))
  }
}

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB max image size
  },
})

/**
 * POST /api/upload/image
 * Upload inline images for blog posts and rich descriptions (Admin only).
 */
router.post('/image', authRequired, imageUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded. Please attach a valid image file.' })
  }

  const fileUrl = `/uploads/images/${req.file.filename}`

  res.status(201).json({
    success: true,
    url: fileUrl,
    filename: req.file.originalname,
    storedFilename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  })
})

export default router

