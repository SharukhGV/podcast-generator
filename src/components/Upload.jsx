// // Upload.jsx
// import React, { useState } from 'react';
// import axios from 'axios';

// const Upload = () => {
//   const [text, setText] = useState('');
//   const [file, setFile] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('text', text);
//     if (file) formData.append('file', file);

//     await axios.post('http://localhost:5000/upload', formData);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" />
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button type="submit">Upload</button>
//     </form>
//   );
// };

// export default Upload;
