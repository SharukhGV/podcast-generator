// import { Cloudinary } from 'cloudinary-react';

// const cloudinary = new Cloudinary({
//   cloud_name: 'xxxxxx',
//   api_key: 'xxxxxx',
//   api_secret: '<your_api_secret>'
// });

// const AudioUpload = () => {
//   const [audioUrl, setAudioUrl] = useState(null);

//   const handleAudioUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Replace with your Cloudinary upload preset

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/damkrnln2/video/upload`,
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       const data = await response.json();
//       setAudioUrl(data.secure_url);
//     } catch (error) {
//       console.error('Error uploading audio:', error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept="audio/*" onChange={handleAudioUpload} />
//       {audioUrl && (
//         <audio controls>
//           <source src={audioUrl} type="audio/mpeg" />
//         </audio>
//       )}
//     </div>
//   );
// };

// export default AudioUpload;