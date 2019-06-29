import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import './Navbar.css';

function NavBar() {
  return (
    <div className="navbar">
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit" className="title">
            <Link to="/" className="link">Needyd</Link>
          </Typography>
          <Button color="inherit">
            <Link to="/privacy-policy" className="link">Privacy Policy</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
