// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../App.css";
// import { v2 as cloudinary } from 'cloudinary';


// const SpeechConverter = () => {
//   const [text, setText] = useState("");
//   const [recording, setRecording] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [transcribedText, setTranscribedText] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const recognition = useRef(null);
//   const mediaRecorder = useRef(null);
//   const audioChunks = useRef([]);
//   const API_URL = "http://localhost:5000";
//   const navigate = useNavigate();


//   const cloudinary = new Cloudinary({
//     cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
//     api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
//     api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
//   });


//   const handleTextSubmit = async () => {
//     if (!text.trim()) {
//       alert("Text cannot be empty");
//       return;
//     }
//     try {
//       await fetch(`${API_URL}/texts`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: text }),
//       });
//       setText("");
//       navigate("/");
//     } catch (error) {
//       console.error("Error saving text", error);
//     }
//   };
// const handleUpload = async () => {
//   if (!selectedFile && !text.trim()) {
//     setError("Please select an audio file or enter text.");
//     return;
//   }

//   setIsUploading(true);
//   setError(null);
//   setUploadSuccess(false);

//   try {
//     let audioUrl = '';
//     if (selectedFile) {
//       const formData = new FormData();
//       formData.append('file', selectedFile);
//       formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//       formData.append('resource_type', 'video');

//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       const data = await response.json();
//       audioUrl = data.secure_url;
//     }

//     const response = await fetch(`${API_URL}/upload`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text, audioUrl }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || "Failed to upload.");
//     }

//     setTranscribedText(data.transcribed_text || "");
//     setUploadSuccess(true);
//     navigate("/");
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setIsUploading(false);
//   }
// };


// const convertToAudioFile = async () => {
//     if (!text.trim()) return;
//     const utterance = new SpeechSynthesisUtterance(text);
//     const audioContext = new AudioContext();
//     const destination = audioContext.createMediaStreamDestination();
//     const recorder = new MediaRecorder(destination.stream);
//     let chunks = [];
  
//     utterance.onstart = () => recorder.start();
//     recorder.ondataavailable = (event) => chunks.push(event.data);
//     recorder.onstop = async () => {
//       const audioBlob = new Blob(chunks, { type: "audio/mp3" });
//       const url = URL.createObjectURL(audioBlob);
//       setDownloadUrl(url);
  
//       const formData = new FormData();
//       formData.append('file', audioBlob, 'speech.mp3');
//       formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//       formData.append('resource_type', 'video');
  
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );
  
//       const data = await response.json();
//       const audioUrl = data.secure_url;
  
//       await fetch(`${API_URL}/upload`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text, audioUrl }),
//       });
  
//       navigate("/");
//     };
  
//     utterance.onend = () => recorder.stop();
//     window.speechSynthesis.speak(utterance);
//   };
  

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setTranscribedText("");
//     setError(null);
//   };

//   const startRecording = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Speech Recognition is not supported in this browser.");
//       return;
//     }

//     recognition.current = new window.webkitSpeechRecognition();
//     recognition.current.continuous = false;
//     recognition.current.interimResults = false;
//     recognition.current.lang = "en-US";

//     recognition.current.onresult = (event) => {
//       setText(event.results[0][0].transcript);
//     };

//     recognition.current.onerror = (event) => {
//       console.error("Speech recognition error", event);
//     };

//     recognition.current.onend = () => {
//       setRecording(false);
//     };

//     setRecording(true);
//     recognition.current.start();
//   };

//   const stopRecording = () => {
//     recognition.current?.stop();
//     setRecording(false);
//   };

//   const startAudioRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorder.current = new MediaRecorder(stream);
//     audioChunks.current = [];
  
//     mediaRecorder.current.ondataavailable = (event) => {
//       audioChunks.current.push(event.data);
//     };
  
//     mediaRecorder.current.onstop = async () => {
//       const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
//       const url = URL.createObjectURL(audioBlob);
//       setDownloadUrl(url);
  
//       const formData = new FormData();
//       formData.append('file', audioBlob, 'recorded.mp3');
//       formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//       formData.append('resource_type', 'video');
  
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );
  
//       const data = await response.json();
//       const audioUrl = data.secure_url;
  
//       await fetch(`${API_URL}/upload`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ audioUrl }),
//       });
  
//       navigate("/");
//     };
  
//     mediaRecorder.current.start();
//     setRecording(true);
//   };
  

//   const stopAudioRecording = () => {
//     mediaRecorder.current?.stop();
//     setRecording(false);
//   };

//   return (
//     <div>
//       <h2>Speech & Audio Manager</h2>

//       <textarea value={text} onChange={(e) => setText(e.target.value)} />
//       <input type="file" accept="audio/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
//       <button onClick={handleUpload} disabled={isUploading}>
//         {isUploading ? "Uploading..." : "Upload Text and/or Audio"}
//       </button>

//       <h3>Text-to-Speech</h3>
//       <button onClick={convertToAudioFile}>Convert to AI Voice</button>

//       {downloadUrl && (
//         <a href={downloadUrl} download="converted.mp3">
//           <button>Download Audio</button>
//         </a>
//       )}

//       <h3>Record and Convert Speech</h3>
//       <button onClick={recording ? stopRecording : startRecording}>
//         {recording ? "Stop Recording" : "Start Recording (Speech-to-Text)"}
//       </button>

//       <h3>Record Voice Memo</h3>
//       <button onClick={recording ? stopAudioRecording : startAudioRecording}>
//         {recording ? "Stop Recording" : "Start Recording (Voice Memo)"}
//       </button>

//       <h3>Upload Audio for Transcription</h3>
//       <input type="file" accept="audio/*" onChange={handleFileChange} />
//       {selectedFile && <p>Selected file: {selectedFile.name}</p>}
//       <button onClick={handleUpload} disabled={isUploading}>
//         {isUploading ? "Uploading..." : "Upload & Transcribe"}
//       </button>

//       {error && <p className="error">{error}</p>}
//       {uploadSuccess && <p className="success">Upload successful!</p>}
//       {transcribedText && (
//         <div>
//           <h4>Transcribed Text</h4>
//           <p>{transcribedText}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SpeechConverter;
