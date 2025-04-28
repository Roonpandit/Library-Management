  import fs from 'fs';
  import multer from 'multer';
  import path from 'path';
  
  const uploadDir = path.join(__dirname, '../../uploads/');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'));
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter,
  });
  
  export default upload;