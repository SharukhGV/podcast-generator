// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "../../App.css";

// const IndexPage = () => {
//   const [entries, setEntries] = useState([]);
//   const API_URL = "http://localhost:5000";

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   const fetchEntries = async () => {
//     try {
//       const response = await fetch(`${API_URL}/entries`);
//       const data = await response.json();
//       setEntries(data);  // Store both text and audio entries
//     } catch (error) {
//       console.error("Failed to fetch entries", error);
//     }
//   };

//   return (
//     <div>
//       <h2>All Entries</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Content</th>
//             <th>Type</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {entries.map((entry) => (
//             <tr key={entry.id}>
//               <td>{entry.id}</td>
//               <td>
//                 {/* Show content for text entries */}
//                 {entry.content ? entry.content.substring(0, 50) + "..." : entry.file_path ? "Audio file" : "No content"}
//               </td>
//               <td>
//                 {/* Show 'Text' or 'Audio' based on the entry */}
//                 {entry.content ? "Text" : entry.file_path ? "Audio" : "Unknown"}
//               </td>
//               <td>
//                 <Link to={`/entry/${entry.id}`}>View/Edit</Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default IndexPage;
