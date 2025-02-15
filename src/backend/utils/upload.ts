// Importing the multer library for handling file uploads
import multer from 'multer';

// Importing the path module for working with file and directory paths
import path from 'path';

// Configuring the storage settings for multer
const storage = multer.diskStorage({
    // Setting the destination for uploaded files
    destination: (_req, _file, cb) => {
        // Callback to specify the upload directory, defaults to './uploads' if not set
        cb(null, process.env.UPLOAD_DIR || './uploads');
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
