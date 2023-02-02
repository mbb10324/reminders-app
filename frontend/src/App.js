import './App.css';
import Home from "./Components/Home";
import Login from "./Components/Login"
import Context from './Context';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    fetch("http://localhost:3030/reminders")
      .then((response) => response.json())
      .then((data) => { setReminders(data) })
  }, []);

  return (
    <div className="App">
      <Context.Provider value={{ reminders }}>
        <Router>
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </Context.Provider>
    </div>
  );
}

export default App;
