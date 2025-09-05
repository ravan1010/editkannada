const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');


const app = express();

// Middleware
// app.use(express.urlencoded({ extended: true, limit: '200mb' }));
// app.use(express.json({ limit: '200mb' }));

// Folders
if (!fs.existsSync('outputs')) fs.mkdirSync('outputs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// CORS (explicit frontend domain)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// FFmpeg binary
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
  console.log("Using ffmpeg-static:", ffmpegStatic);
} else {
  ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
  console.log("Using system ffmpeg: /usr/bin/ffmpeg");
}

// Routes
app.get('/connect', (req, res) => {
  console.log('connected');
  res.json({ message: 'connected' });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


app.post('/upload', upload.single('image'), (req, res) => {
  try {
    const imagePath = req.file; // ✅ multer saved the file

    const name = Date.now()

    const injp = path.join(__dirname, 'uploads', imagePath.filename);
    console.log(imagePath.originalname, injp)

    ffmpeg('input.mp4')
      .input(imagePath.path)
      .complexFilter([
        '[1:v]format=rgba,colorchannelmixer=aa=0.5,scale=430:930[logo];[0:v][logo]overlay=20:20'
      ])
      .output(`./outputs/download${name}.mp4`)
      .on('end', () => {
        console.log('JPEG overlay with opacity added!');
        fs.unlinkSync(injp)
        res.json({ message: "Processing complete", filename: `download${name}.mp4` });
      })
      .on('error', (err) => {
        console.error('Error: ' + err.message);
        res.status(500).json({ error: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json(error);
  }
});

app.get('/api/preview/:id', (req, res) => {
  const id = req.params.id;
  const filePath = path.join(__dirname, 'outputs', id);

  if (id.endsWith(".mp4") && fs.existsSync(filePath)) {
    res.sendFile(filePath);
    setTimeout(() => {
      if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
      }
    }, 100000);
  } else {
    res.json({ message: "File not found" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
