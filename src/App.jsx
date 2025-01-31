
// Frontend (React + react-router-dom)
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Upload from './components/Upload';
// import Entries from './components/Entries';
// import EditEntry from './components/EditEntry';
import Home from './components/Home';
import Navbar from './components/NavBar';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';
import EntryFormEdit from './components/EntryFormEdit';

function App() {
  return (
    <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<EntryForm />} />
          <Route path="/form/:id" element={<EntryFormEdit />} />
          <Route path="/list" element={<EntryList />} />
          <Route path="*" element={<Home />} />
        </Routes>
    </Router>
  );
}

export default App;
