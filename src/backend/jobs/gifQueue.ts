import fs from 'fs';
import path from 'path';

//Cleanup GIFs older than 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000; // calculates the duration in milliseconds for a cleanup operation.

export const cleanupOldGIFs = () => {
    const gifDir = path.resolve(process.cwd(), "gifs").replace(/\\/g, "/");
    if(!fs.existsSync(gifDir)) return;

    fs.readdir(gifDir, (err, files) => {
        if(err) {
            console.error("❌ Error reading GIF directory:", err);
            return;
        }

        const now = Date.now();
        files.forEach((file) => {
            const filePath = path.join(gifDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) 
                {
                    console.warn(`⚠️ Could not access ${filePath}`, err);
                    return;
                }

                if(now - stats.mtimeMs > CLEANUP_INTERVAL)
                {
                    fs.unlink(filePath, (err) => {
                        if (err) console.warn(`⚠️ Failed to delete old GIF: ${filePath}`, err);
            else        console.log(`🗑️ Deleted old GIF: ${filePath}`);
                    });
                }

            });
        });

    });

};

// Run cleanup every 10 minutes
setInterval(cleanupOldGIFs, CLEANUP_INTERVAL);
console.log("🧹 GIF cleanup job started, running every 10 minutes.");