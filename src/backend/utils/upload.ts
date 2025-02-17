// Importing the multer library for handling file uploads
import multer from 'multer';

// Importing the path module for working with file and directory paths
import path from 'path';

// Importing the fs module for file system operations
import fs from 'fs';

// Configuring the storage settings for multer
const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    // Setting the destination for uploaded files
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    // Setting the filename for uploaded files
    filename: (_req, file, cb) => {
        // Generating a unique suffix for the filename using current timestamp and random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // Callback to specify the final filename with the original file extension
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

// Exporting the configured multer instance for use in other parts of the application
export const upload = multer({ storage });
