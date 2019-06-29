import React from 'react';
import './App.css';
import Lookup from './components/Lookup';
import PrivacyPolicy from './components/PrivacyPolicy';
import Navbar from './components/Navbar';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Lookup} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
