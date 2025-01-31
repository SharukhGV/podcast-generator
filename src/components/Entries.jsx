
// // Entries.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const Entries = () => {
//   const [entries, setEntries] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:5000/entries').then((res) => setEntries(res.data));
//   }, []);

//   return (
//     <div>
//       <h1>Podcast Entries</h1>
//       {entries.map((entry) => (
//         <div key={entry.id}>
//           <p>{entry.content}</p>
//           <audio src={entry.file_path} controls></audio>
//           <Link to={`/edit/${entry.id}`}>Edit</Link>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Entries;