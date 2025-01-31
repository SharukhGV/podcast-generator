
// // EditEntry.jsx
// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const EditEntry = () => {
//   const { id } = useParams();
//   const [content, setContent] = useState('');

//   const handleUpdate = async () => {
//     await axios.put(`http://localhost:5000/entries/${id}`, { content });
//   };

//   return (
//     <div>
//       <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
//       <button onClick={handleUpdate}>Update</button>
//     </div>
//   );
// };

// export default EditEntry;