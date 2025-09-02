import { useEffect, useState } from "react";
import axios from "axios";
import VideoPreview from "./preview";
import VideoDownload from "./videodownload"


function UploadVideos() {
  const [videos, setVideos] = useState([]);
  const [data, setdata] = useState('');
  const [loading, setloading] = useState('');
  const [file, setfile] = useState('') ;
  // const l = "https://kannadaedit.onrender.com"
  const server = "https://editkannada.onrender.com";


  const handleChange = (e) => {
    // setVideos([...e.target.files]);
      const value = ([...e.target.files]);

     if(value.length > 3 || value.length < 3){
           alert("You can only upload up to 3 files.");
            e.target.value = ''; // Clear the input
            return;
        }else{
            setVideos([...e.target.files]);
              setfile("fileset")
        }
  };
  const handleUpload = async () => {
    if(file === "fileset"){
      setloading("loading")
    const formData = new FormData();
    videos.forEach((file, index) => {
      formData.append(`video${index + 1}`, file);
    });

   await axios.post(`${server}/upload`,formData,{withCredentials: true},{
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
        setdata(res.data.filename)
        console.log(res.data.filename)
        setloading('complete')
        
    })
  }else{
    alert('upload video')
  }
  
  };
 

  return (
    <>
   
    <div  className='w-screen h-auto flex justify-center pt-2 bg-white'>
      <div className='flex flex-col items-center md:w-200 w-full md:px-10 border-2 bg-black'>
        <div className='flex flex-col items-center ' >
        <div className='flex flex-col'>  
          <label className="block md:mb-1 mb-2 text-sm font-medium text-gray-900 dark:text-white"  htmlFor="fileinput">Upload file</label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" id="fileinput" multiple accept="video/mp4" onChange={handleChange} required />
      </div>
      <button className='text-white px-9 md:mt-1 mt-2 bg-sky-500 hover:bg-sky-700 rounded-2 mb-2 rounded-3xl' onClick={handleUpload}>Submit</button>
      <h1 className="text-amber-50"> {loading} </h1>
      </div>

      <div>
        <hr className="border-2 w-full border-blue-900 mt-1" />
      
        <div>
          <h2>Final Video</h2>
          <VideoPreview filename={data} />
          <VideoDownload filename={data} />
        </div>
      </div>
      </div>
    </div> 
    </>
  );
}

export default UploadVideos
