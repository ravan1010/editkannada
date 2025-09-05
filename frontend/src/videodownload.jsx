import axios from "axios";

function VideoDownload({ filename }) {
  const handleDownload = async () => {
    // const server = "https://editkannada.onrender.com"
      const server = "http://localhost:5000";

    const response = await axios.get(
      `${server}/api/preview/${filename}`,{withCredentials: true},
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "video/mp4" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return <button onClick={handleDownload}>Download Video</button>;
}

export default VideoDownload;
