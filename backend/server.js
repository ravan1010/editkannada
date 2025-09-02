const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const cors = require('cors')

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
  console.log("Using ffmpeg-static:", ffmpegStatic); 
} else {
  // fallback to system ffmpeg (if available)
  ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
  console.log("Using system ffmpeg: /usr/bin/ffmpeg");
}

// Set the path to the static ffmpeg binary


if (!fs.existsSync('outputs')) fs.mkdirSync('outputs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const input = path.resolve(__dirname,  'input.mp4');
const inputaudio = path.resolve(__dirname,  'audio.mp3');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // reflects request origin automatically
  credentials: true
}));

const upload = multer({ dest: 'uploads/' });

const PORT = 5000;


app.post('/upload', upload.fields([
  { name: 'video1' }, { name: 'video2' }, { name: 'video3' }
]), async (req, res) => {
  try {
    
    const files = req.files;
    const inputvideo1 = files.video1[0].path;
    const inputvideo2 = files.video2[0].path;
    const inputvideo3 = files.video3[0].path;
    const inputname1 = files.video1[0].originalname;
    const inputname2 = files.video2[0].originalname;
    const inputname3 = files.video3[0].originalname;

    console.log(files.video1[0].path, files.video1)

    //trim 0 on audio 
     const outPath = `outputs/trimmed0.mp4`;
      await new Promise((resolve, reject) => {
        ffmpeg(input)
          .setStartTime('00:00:00')
          .setDuration(9.3)
          .noAudio()
          .videoFilters([
    // Step 1: scale larger than 9:16 to allow zooming
              "scale=1080*1.5:1920*1.5",

              // Step 2: crop to 1080x1920 (9:16)
              "crop=1080:1920",

              // Step 3: fade-in (first 1 second)
              " fps=30",
              // "zoompan=z='1.5-0.01*in':d=2.3"
          ])
          .outputOptions([
            '-r 30',
            // "-t 5",              // output duration (adjust as needed)
            "-preset veryfast",  // faster encoding
            "-pix_fmt yuv420p",   // ensures compatibility across players
            '-c:v libx264',
          ])
          .output(outPath)
          .on('end', () => resolve(outPath))
          .on('error', reject)
          .run(); 
      });
 
      console.log(outPath) 
      // console.log("ffmpeg path:", ffmpegPath);


    // Step 1: Trim video 1
      const outPath1 = `outputs/${inputname1}`;
      await new Promise((resolve, reject) => {
        ffmpeg(inputvideo1)
            .setStartTime('00:00:00')
            .setDuration(2.4)
            .noAudio()
            .videoFilters([
    // Step 1: scale larger than 9:16 to allow zooming
              "scale=1080*1.5:1920*1.5",

              // Step 2: crop to 1080x1920 (9:16)
              "crop=1080:1920",

              // Step 3: fade-in (first 1 second
              // "fade=t=in:st=0:d=1,fade=t=out:st=5.3:d=1",
              " fps=30",
            
          ])
          .outputOptions([
            '-r 30',
            // "-t 5",              // output duration (adjust as needed)
            "-preset veryfast",  // faster encoding
            "-pix_fmt yuv420p",   // ensures compatibility across players
            '-c:v libx264',

          ])
          .output(outPath1)
          .on('end', () => resolve(outPath1))
          .on('error', reject)
          .run();
      });

      console.log(outPath1)

    //   //trim video 2
      const outPath2 = `outputs/${inputname2}`;
      await new Promise((resolve, reject) => {
        ffmpeg(inputvideo2)
          .setStartTime('00:00:00')
          .setDuration(6)
          .noAudio()
          .videoFilters([
    // Step 1: scale larger than 9:16 to allow zooming
              "scale=1080*1.5:1920*1.5",

              // Step 2: crop to 1080x1920 (9:16)
              "crop=1080:1920",

              // Step 3: fade-in (first 1 second
              // "fade=t=in:st=0:d=1,fade=t=out:st=6:d=1",
              " fps=30",
            
          ])
          .outputOptions([
            '-r 30',            // "-t 5",              // output duration (adjust as needed)
            "-preset veryfast",  // faster encoding
            "-pix_fmt yuv420p",   // ensures compatibility across players
            '-c:v libx264',

          ])
          .output(outPath2)
          .on('end', () => resolve(outPath2))
          .on('error', reject)
          .run();
      });

          console.log(outPath2)

      const outPath3 = `outputs/${inputname3}`;
      await new Promise((resolve, reject) => {
        ffmpeg(inputvideo3)
          .setStartTime('00:00:00')
          .setDuration(5)
          .noAudio()
          .videoFilters([
    // Step 1: scale larger than 9:16 to allow zooming
              "scale=1080*1.5:1920*1.5",

              // Step 2: crop to 1080x1920 (9:16)
              "crop=1080:1920",

              // Step 3: fade-in (first 1 second)
              // "fade=t=in:st=0:d=1,fade=t=out:st=5.3:d=1",
              " fps=30",
              // "zoompan=z='1.5-0.01*in':d=2.3"
            
          ])
          .outputOptions([
            '-r 30',
            // "-t 5",              // output duration (adjust as needed)
            "-preset veryfast",  // faster encoding
            "-pix_fmt yuv420p",   // ensures compatibility across players
            '-c:v libx264',

          ])
          .output(outPath3)
          .on('end', () => resolve(outPath3))
          .on('error', reject)
          .run();
      });

      console.log(outPath3)
    
      const videofiles = [
            path.resolve(__dirname, 'outputs/trimmed0.mp4'),
            path.resolve(__dirname, `outputs/${inputname1}`),
            path.resolve(__dirname, `outputs/${inputname2}`),
            path.resolve(__dirname, `outputs/${inputname3}`)
            ];
      

    

    // Step 2: Write list for concat
    const listPath = `outputs/filelist${inputname1}.txt`;
    fs.writeFileSync(listPath, videofiles.map(file => `file '${file}'`).join('\n') );

    // // Step 3: Concatenate
    const concatOutput = `outputs/merged_${inputname1}`;

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(listPath)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions('-c copy')
        .output(concatOutput)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

      console.log(concatOutput)

       fs.unlinkSync(`outputs/filelist${inputname1}.txt`);
      console.log('.txt file deleted');
      
      fs.unlinkSync(`outputs/${inputname1}`);
      fs.unlinkSync(`outputs/${inputname2}`);
      fs.unlinkSync(`outputs/${inputname3}`);
      fs.unlinkSync(`uploads/${files.video1[0].filename}`);
      fs.unlinkSync(`uploads/${files.video2[0].filename}`);
      fs.unlinkSync(`uploads/${files.video3[0].filename}`)

    // // Step 4: Add audio
    const finalOutput = `outputs/final_${inputname1}`;
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(concatOutput)
        .input(inputaudio)
        // .outputOptions('-shortest')
        .output(finalOutput)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    fs.unlinkSync(`outputs/merged_${inputname1}`);
    console.log('.mp4 file deleted');  
    console.log(finalOutput)

    res.json({filename: inputname1});

  } catch (err) {
    console.error(err);
    res.status(500).send('Processing failed');
  }
});


app.get('/api/preview/:id', (req, res) => {
  const id = req.params.id;

  setTimeout(() => {
      fs.unlinkSync(`outputs/final_${id}`);
  }, 100000); 

  if (id.endsWith(".mp4")) {
    const filePath = path.join(__dirname, 'outputs', `final_${id}`);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);  // allows streaming in <video>
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid file format" });
  }
});







app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
