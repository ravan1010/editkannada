import { useEffect, useState } from "react";
import axios from "axios";
import VideoPreview from "./preview";
import VideoDownload from "./videodownload"


function UploadVideos() {
  const [videos, setVideos] = useState([]);
  const [data, setdata] = useState('');
  const [loading, setloading] = useState('');
  const [file, setfile] = useState('') ;
  const server = "https://editkannada.onrender.com";
  // const server = "http://localhost:5000";

useEffect(() => {
  const con = async () => {
    try {
      const res = await axios.get(`${server}/connect`, { withCredentials: true });
      console.log(res.data.message);
    } catch (err) {
      console.error("Connection failed", err);
    }
  };
  con();
}, []);



 const handleUpload = async () => {
  if (!file) {
    alert("Please select an image first");
    return;
  }

  setloading("loading");
  setVideos('')
  setdata('')
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(`${server}/upload`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" }
    });
    setdata(res.data.filename);
    setVideos(`${server}/api/preview/${res.data.filename}`)
    setloading("complete");
  } catch (err) {
    console.error("Upload failed:", err);
    setloading("error");
  }
};
 

  return (
    <>
   
    <div  className='w-screen h-auto flex justify-center pt-2 bg-white'>
      <div className='flex flex-col items-center md:w-200 w-full md:px-10 border-2 bg-black'>
        <div className='flex flex-col items-center ' >
        <div className='flex flex-col'>  
          <label className="block md:mb-1 mb-2 text-sm font-medium rounded-2xl border-2 px-6 m-4 py-1 text-gray-900 dark:text-white"  htmlFor="fileinput">Upload file</label>
          <input className="hidden " 
              id="fileinput"
              type="file" 
              accept="image/jpeg" 
              onChange={(e) => setfile(e.target.files[0])} 
            />
      </div>
      <button className='text-white px-9 md:mt-1 mt-2 bg-sky-500 hover:bg-sky-700 rounded-2 mb-2 rounded-3xl' onClick={handleUpload}>Submit</button>
      <h1 className="text-amber-50"> {loading} </h1>
      {data && (
          <div className="w-full px-auto my-3 block border-2 text-white"><VideoDownload filename={data} /></div>
      )}

      </div>

      <div>
        <hr className="border-2 w-full border-blue-900 mt-1" />
      
      
        <div className="text-white w-full items-center flex-col ">
          {data && (

          <video
          src={videos}
          controls
          width="400"
          style={{ marginTop: "10px" }}
        />
        )}
          {/* <VideoPreview filename={data} /> */}

        </div>
      </div>
      </div>
    </div> 
    </>
  );
}

export default UploadVideos
