import { createClient } from "@supabase/supabase-js";
import Students from "./Students.jsx"
import "./App.css";
import Rosters from "./Rosters.jsx"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() { 
  return ( 
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/students">Students</Link> |{" "}
        <Link to="/rosters">Rosters</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/rosters" element={<Rosters />} />
      </Routes>
    </BrowserRouter>
  ); 
} 

function Home() {
  return <h1>Welcome to Wizarding School</h1>;
}

export default App;