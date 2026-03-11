import { createClient } from "@supabase/supabase-js";
import Students from "./Students.jsx"
import "./App.css";
import Rosters from "./Rosters.jsx"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
const supaKey = "sb_publishable_wZ7Og9UpSIzd6u9AwS_AMg_U9LvEnUU";
const supaUrl = "https://byyqrzsfnteoqtxtjuhp.supabase.co";
import { useEffect, useState} from "react";
const supabase = createClient(supaUrl, supaKey);

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
  const [students, setStudents] = useState(new Map());
  const [grades, setGrades] = useState(new Map());
  const [ranks, setRanks] = useState([]);
  useEffect(()=>
        {
          getStudents();
        },[]);

  useEffect(()=>{getGrades();},[students]);
      useEffect(() => {
        console.log(grades);
        console.log(students);
        getRanks();
    }, [students, grades]);
    async function getStudents() {
    const { data } = await supabase.from("Students").select();
    const newMap = new Map(); // Cloning the Map to keep immutability
    for (const obj of data)
    {newMap.set(obj.StudentID, obj)};
    setStudents(newMap); // Updating the state
  }
  async function getGrades()
  {
    const { data } = await supabase.from("Grades").select();
    const newMap = new Map(); // Cloning the Map to keep immutability
    for (const obj of data)
    {newMap.set(obj.StudentID, obj)};
    setGrades(newMap); // Updating the state
  }
  async function getRanks() {
  let rankings=[];
  for (const key of students.keys())
  {
    console.log(key);
    console.log(key);
    console.log(grades.get(key))
    let full = students.get(key).First + " " + students.get(key).Last;
    let average = grades.get(key).Grade1 + grades.get(key).Grade2 + grades.get(key).Grade3;
    console.log(grades.get(key).Grade1);
    average = Math.round((average*100)/3)/100;
    rankings.push({name: full, avg:average})
    console.log(full,average);
  }

  rankings.sort((a,b)=>{
  return b.avg - a.avg;}) 
  console.log(rankings);
  setRanks(rankings.slice(0,10));
  }
  return (<div className="Home">
            <h1>Welcome to Wizarding School</h1>
            <ol>
            {ranks.map((student) => (<li><div>{student.name}</div><div>{student.avg}</div></li>))}
            </ol>
          </div>);
}

export default App;