
// EntryList component remains the same as before

import { useState,useEffect } from "react";
import axios from "axios";
const EntryList = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/entries`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND}/api/entries/${id}`);
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <div style={{border:"solid", borderRadius:"10px", padding:"10px"}} key={entry.id} className="p-4 border rounded-lg shadow-sm">
          <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
          {entry.file_path && (
            <div className="mt-4">
              <audio controls src={entry.file_path} className="w-full" />
            </div>
          )}
          <div className="mt-4 space-x-2">
            <button
              onClick={() => window.location.href = `/form/${entry.id}`}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(entry.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EntryList