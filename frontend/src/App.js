import './App.css';
import Home from "./Components/Home";
import Login from "./Components/Login"
import Help from "./Components/Help"
import About from "./Components/About"
import Privacy from "./Components/Privacy"
import Terms from "./Components/Terms"
import Security from "./Components/Security"
import Account from "./Components/Account"
import Groups from "./Components/Groups"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/Help" element={<Help />} />
          <Route path="/About" element={<About />} />
          <Route path="/Privacy" element={<Privacy />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/Security" element={<Security />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Groups" element={<Groups />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
