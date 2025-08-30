import { useState } from "react";

function VideoPreview({ filename }) {
  const [videoUrl, setVideoUrl] = useState(null);

  const from = "https://kannadaedit.onrender.com"

  const handlePreview = () => {
    // Direct video stream (not blob) so <video> can play
    setVideoUrl(`${from}/api/preview/${filename}`);
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
