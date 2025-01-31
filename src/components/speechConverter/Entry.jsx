// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const Entry = () => {
//   const [entry, setEntry] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedText, setEditedText] = useState("");
//   const [audioUrl, setAudioUrl] = useState("");
//   const [audioFile, setAudioFile] = useState(null);
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const API_URL = "http://localhost:5000";
//   const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;

//   useEffect(() => {
//     fetchEntry();
//   }, [id]);

//   const fetchEntry = async () => {
//     try {
//       const response = await fetch(`${API_URL}/entry/${id}`);
//       const data = await response.json();
//       setEntry(data);
//       setEditedText(data.content ?? "");
//       setAudioUrl(data.file_path || "");
//     } catch (error) {
//       console.error("Failed to fetch entry", error);
//     }
//   };

//   const handleAudioUpload = async (event) => {
//     const file = event.target.files[0];
//     setAudioFile(file);
//   };

//   const uploadToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//     formData.append("resource_type", "video");

//     try {
//       const response = await fetch(CLOUDINARY_URL, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       return data.secure_url;
//     } catch (error) {
//       console.error("Error uploading to Cloudinary:", error);
//       throw error;
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       let audioFileUrl = audioUrl;
//       if (audioFile) {
//         audioFileUrl = await uploadToCloudinary(audioFile);
//       }

//       const updateResponse = await fetch(`${API_URL}/entry/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           content: editedText,
//           file_path: audioFileUrl,
//         }),
//       });

//       if (!updateResponse.ok) {
//         throw new Error(`HTTP error! status: ${updateResponse.status}`);
//       }

//       const updatedEntry = await updateResponse.json();
//       setEntry(updatedEntry);
//       setAudioUrl(audioFileUrl);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Failed to save entry", error);
//     }
//   };

//   // ... rest of your component code ...

//   return (
//     <div>
//       <h2>{isEditing ? "Edit Entry" : "Entry Details"}</h2>
//       {entry && (
//         <>
//           <div>
//             <h3>Text Content:</h3>
//             {isEditing ? (
//               <textarea
//                 value={editedText}
//                 onChange={(e) => setEditedText(e.target.value)}
//               />
//             ) : (
//               <p>{entry.content}</p>
//             )}
//           </div>
//           <div>
//             <h3>Audio:</h3>
//             {audioUrl && <audio controls src={audioUrl} />}
//             {isEditing && (
//               <input type="file" accept="audio/*" onChange={handleAudioUpload} />
//             )}
//           </div>
//           <div>
//             <button onClick={() => setIsEditing(!isEditing)}>
//               {isEditing ? "Cancel" : "Edit"}
//             </button>
//             {isEditing && <button onClick={handleSave}>Save</button>}
//             <button onClick={handleDelete}>Delete</button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Entry;
