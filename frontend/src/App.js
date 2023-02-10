import './App.css';
import Home from "./Components/Home";
import Login from "./Components/Login"
import Help from "./Components/Help"
import About from "./Components/About"
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/Help" element={<Help/>} />
          <Route path="/About" element={<About/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
