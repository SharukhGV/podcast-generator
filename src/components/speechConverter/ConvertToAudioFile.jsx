// import lamejs from "lamejs";

// const convertToAudioFile = async () => {
//   const utterance = new SpeechSynthesisUtterance(text);
//   const audioContext = new AudioContext();
//   const destination = audioContext.createMediaStreamDestination();
//   const mediaRecorder = new MediaRecorder(destination.stream);
//   let audioChunks = [];

//   utterance.onstart = () => mediaRecorder.start();
//   utterance.onend = () => mediaRecorder.stop();

//   mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
//   mediaRecorder.onstop = async () => {
//     const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

//     // Convert to MP3
//     const arrayBuffer = await audioBlob.arrayBuffer();
//     const pcmData = new Int16Array(arrayBuffer);
//     const mp3Encoder = new lamejs.Mp3Encoder(1, audioContext.sampleRate, 128);
//     const mp3Data = [];
//     let blockSize = 1152;
    
//     for (let i = 0; i < pcmData.length; i += blockSize) {
//       const sampleChunk = pcmData.subarray(i, i + blockSize);
//       const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
//       if (mp3buf.length > 0) {
//         mp3Data.push(mp3buf);
//       }
//     }
//     const finalMp3 = mp3Encoder.flush();
//     if (finalMp3.length > 0) {
//       mp3Data.push(finalMp3);
//     }

//     const mp3Blob = new Blob(mp3Data, { type: "audio/mp3" });
//     const url = URL.createObjectURL(mp3Blob);
//     setDownloadUrl(url);

//     // Upload MP3 file to backend
//     const formData = new FormData();
//     formData.append("audio", mp3Blob, "speech.mp3");
//     formData.append("text", text);

//     await fetch("http://localhost:5000/upload", {
//       method: "POST",
//       body: formData,
//     });
//   };

//   window.speechSynthesis.speak(utterance);
// };











// import React, { useState, useRef } from "react";

// const SpeechConverter = () => {
//   const [text, setText] = useState("");
//   const [recording, setRecording] = useState(false);
//   const [audioFile, setAudioFile] = useState(null);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const recognition = useRef(null);

  
//   // Speech-to-Text
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

//   // Text-to-Speech
//   const speakText = () => {
//     if (!window.speechSynthesis) {
//       alert("Text-to-Speech is not supported in this browser.");
//       return;
//     }
//     const utterance = new SpeechSynthesisUtterance(text);
//     window.speechSynthesis.speak(utterance);
//   };

//   // Convert Speech to Audio File and Upload
//   const convertToAudioFile = async () => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     const audioContext = new AudioContext();
//     const destination = audioContext.createMediaStreamDestination();
//     const mediaRecorder = new MediaRecorder(destination.stream);
//     let audioChunks = [];

//     utterance.onstart = () => mediaRecorder.start();
//     utterance.onend = async () => {
//       mediaRecorder.stop();
//     };

//     mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
//     mediaRecorder.onstop = async () => {
//       const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
//       const url = URL.createObjectURL(audioBlob);
//       setDownloadUrl(url);
      
//       const formData = new FormData();
//       formData.append("audio", audioBlob, "speech.mp3");
//       formData.append("text", text);
      
//       await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });
//     };
    
//     window.speechSynthesis.speak(utterance);
//   };

//   // Upload and Convert Audio to Text
//   const handleAudioUpload = async (event) => {
//     const file = event.target.files[0];
//     setAudioFile(file);
    
//     const formData = new FormData();
//     formData.append("audio", file);
    
//     const response = await fetch("http://localhost:5000/transcribe", {
//       method: "POST",
//       body: formData,
//     });
    
//     const data = await response.json();
//     setText(data.transcript);
//   };

//   return (
//     <div>
//       <h2>Speech-to-Text & Text-to-Speech</h2>
//       <button onClick={recording ? stopRecording : startRecording}>
//         {recording ? "Stop Recording" : "Start Recording"}
//       </button>
//       <textarea value={text} onChange={(e) => setText(e.target.value)} />
//       <button onClick={speakText}>Convert to Speech</button>
//       <button onClick={convertToAudioFile}>Save Audio</button>
//       <input type="file" accept="audio/*" onChange={handleAudioUpload} />
//       {downloadUrl && (
//         <a href={downloadUrl} download="speech.mp3">
//           <button>Download Audio</button>
//         </a>
//       )}
//     </div>
//   );
// };

// export default SpeechConverter;
