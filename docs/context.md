Whirrl.ai - Project Context
🌟 Overview
Whirrl.ai is an AI-powered video-to-GIF tool that allows users to create high-quality, customized GIFs from video files. The platform aims to make GIF creation simple, efficient, and interactive by offering:

✅ Video Upload: Users can upload videos in MP4, MOV, and other common formats.
✅ Timestamp Selection: Instead of converting the whole video, users can pick specific segments for GIF generation.
✅ Speech-to-Text Captions: AI-powered speech recognition (Whisper) extracts spoken words and automatically adds captions to GIFs.
✅ Custom Text Overlay: Users can replace captions with their own custom text if preferred.
✅ Font & Style Customization: Users can select fonts, colors, and sizes to personalize GIF captions.
✅ Efficient GIF Processing: Optimized backend ensures fast conversion without quality loss.
✅ Download & Sharing: Users can download individual GIFs or batch-download as a ZIP file.

🎯 Goal
Whirrl.ai is designed to be a fast, customizable, and user-friendly GIF creation tool that simplifies video-to-GIF conversion while allowing creative control.

🔹 Why is it unique?
Unlike basic GIF converters, Whirrl.ai integrates AI speech recognition, real-time text customization, and advanced UI animations, making GIF creation more interactive and dynamic.

🔹 Who is it for?
Content creators who need GIFs for social media.
Businesses & marketers for promotional GIFs.
Meme creators who want funny GIFs with custom captions.
Educators & bloggers who use GIFs for explanations and tutorials.

🏗️ Tech Stack
Frontend (User Interface & Experience)
React + TypeScript → Component-based UI with strong type safety.
Tailwind CSS → Sleek, responsive design with minimal CSS overhead.
Framer Motion → Animated UI elements, smooth transitions, and interactive effects.
Backend (Processing & API Handling)
Node.js + Express → Manages file uploads, API requests, and processing.
Multer → Handles video file uploads securely.
FFMPEG → Converts video segments into GIFs with high efficiency.
AI Processing (Speech-to-Text & Captions)
Whisper.cpp (OpenAI Whisper model) → Extracts spoken words from videos.
Python Backend Module → Handles speech-to-text conversion efficiently.
Storage & File Handling
Uploads Folder (/uploads/) → Stores raw video files.
GIFs Folder (/gifs/) → Stores processed GIFs before user download.

🔥 Key Features
✔ Timestamp-based GIF selection → Users can choose up to 5 segments instead of processing the full video, else the full video will be processed and the first 5 gifs will be generated.
✔ Auto-generated speech captions → AI detects speech and adds captions automatically.
✔ Custom text overlays → Users can disable captions and add their own text instead.
✔ Font & color customization → Select from multiple font families, sizes, and colors.
✔ Optimized, high-quality GIF output → Uses FFMPEG settings for file-size efficiency & visual clarity.
✔ Progress tracking → Animated progress bar indicates processing status dynamically.
✔ Download options → Users can download individual GIFs or a ZIP file with all GIFs.

1) **Home Page:**  
   - **Hero Section:** Logo, tagline, and "Get Started" button.  
   - **Powered By Section**, **Mock Example Section**, **Features Section**, **Contact Section**.  
   - Clicking **"Get Started"** redirects to a new functional page.  

2) **Functional Page:**  
   - **Upload Section:** The decision between an **upload box or just an upload button** will depend on the final page design.  
   - **Font Customization Panel** (Available by default after video upload, regardless of customization choice).  
   - **Font Selection Fields** (Font family, Font size, Font color, and option to **upload custom fonts**).  
   - **Two Buttons:**  
     1. **Generate GIFs Directly** → Scrolls to a progress bar, then GIF Gallery with preview/download options.  
     2. **Additional Customization** → Guides user through step-by-step modifications (timestamps, filters, etc.).  

3) **Upload Behavior:**  
   - Only **video thumbnail, filename, and file size** appear after upload.  
   - GIFs **should not be generated automatically** on upload.  

4) **Step-by-Step Customization:**  
   - Questions appear **one by one**:  
     - "Do you want to add timestamps?"  
     - "Do you want to apply filters?"  
   - Users make selections before proceeding to **Generate GIFs**.  

5) **Final Process:**  
   - Once all preferences are set, user clicks **Generate GIFs** → Progress bar appears → GIF Gallery is shown.  
   - GIF Gallery includes **Preview, Download (single), and Download All (zip)** options.  
   - User is open to suggestions on whether the GIF Gallery should be **on the same page as the Upload Section** or on a different page.  

User is not willing to compromise on this structured flow but is okay with restructuring Whirrl.ai's frontend only if guided through each step while keeping all logic and functionalities intact. They want to ensure the restructure helps progress forward without setbacks.

🏗️ UI/UX Refinements (Planned Improvements)
💡 Better Upload Experience → Interactive drag-and-drop, progress indicator.
💡 Animated UI Effects → More fluid transitions & hover effects for a modern feel.
💡 Dark Mode Toggle → Switch between light & dark themes.
💡 Enhanced GIF Preview → Larger thumbnails, hover play effect.
💡 AI-powered GIF Quality Boost → Sharper, smoother GIFs with ML enhancements.

🚀 Current Status & Next Steps
Whirrl.ai is in its final development phase. The main focus is:

✅ Fixing UI inconsistencies (upload, progress bar, GIF preview).
✅ Ensuring seamless frontend-backend communication.
✅ Optimizing GIF processing speed & accuracy.
✅ Deployment & Hosting (Vercel + Render).

🎯 Final Goal: A smooth, user-friendly, AI-enhanced GIF creator ready for public use!
Why This Detailed Context is Important?
Helps stay focused without distractions.
Ensures no feature is forgotten.
Makes future improvements easier to track.