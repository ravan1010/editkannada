import { useState } from "react";

function VideoPreview({ filename }) {
  const [videoUrl, setVideoUrl] = useState(null);

  // const server = "https://editkannada.onrender.com"
    const server = "http://localhost:5000";


  const handlePreview = () => {
    // Direct video stream (not blob) so <video> can play
    setVideoUrl(`${server}/api/preview/${filename}`);
  };

  return (
    <div>
      <button onClick={handlePreview}>Preview Video</button>
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          width="400"
          style={{ marginTop: "10px" }}
        />
      )}
    </div>
  );
}

export default VideoPreview;
