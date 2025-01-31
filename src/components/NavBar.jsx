import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css"

const Navbar = () => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#333',
      padding: '10px 0',
      zIndex: 1000
    }}>
      <ul style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <li style={{ margin: '0 15px' }}>
          <Link to="/" style={linkStyle}>Home</Link>
        </li>
        <li style={{ margin: '0 15px' }}>
          <Link to="/list" style={linkStyle}>Entries</Link>
        </li>
        <li style={{ margin: '0 15px' }}>
          <Link to="/form" style={linkStyle}>Upload</Link>
        </li>
      </ul>
    </nav>
  );
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold'
};

export default Navbar;
