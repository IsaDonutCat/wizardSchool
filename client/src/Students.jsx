const supaKey = "sb_publishable_wZ7Og9UpSIzd6u9AwS_AMg_U9LvEnUU";
const supaUrl = "https://byyqrzsfnteoqtxtjuhp.supabase.co";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
const supabase = createClient(supaUrl, supaKey);

function Students()
{
  const [students, setStudents] = useState(new Map());
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState(new Map());
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [grades, setGrades] = useState(new Map());
  useEffect(()=>
  {
    getStudents();
    getCourses();
    getSchedules();
    getGrades();
  },[]);

  useEffect(() => {
  getFilteredData();
  }, [search, schedules, students]);

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
  async function getCourses() {
    const { data } = await supabase.from("Courses").select();
    const newMap = new Map(); // Cloning the Map to keep immutability
    for (const obj of data)
    {newMap.set(obj.CourseCode, obj.CourseTitle)};
    setCourses(newMap); // Updating the state
  }
  async function getSchedules() {
    const { data } = await supabase.from("Schedules").select();
    setSchedules(data);
  }

   function getFilteredData()
  {
    console.log(search)
    let newData = [];
    newData = schedules.filter((obj) => 
    {
      let stuID = obj.StudentID
      let first = students.get(stuID).First;
      let last = students.get(stuID).Last;
      let full = first + " " + last;
      
      return (first.toLowerCase().includes(search.toLowerCase()) ||
        last.toLowerCase().includes(search.toLowerCase()) ||
        full.toLowerCase().includes(search.toLowerCase()));
    }
    );
  setFilteredData(newData);
  }
  return (
    <div className ='students'>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search here"/>
      <div>
        inside of div
        {filteredData.map((schedules) => (
          <Student 
          first={students.get(schedules.StudentID).First} 
          last={students.get(schedules.StudentID).Last} 
          year={students.get(schedules.StudentID).Year}
          cou1={courses.get(schedules.Course1)}
          cou2={courses.get(schedules.Course2)}
          cou3={courses.get(schedules.Course3)}
          gra1={grades.get((schedules.StudentID)).Grade1}
          gra2={grades.get((schedules.StudentID)).Grade2}
          gra3={grades.get((schedules.StudentID)).Grade3}
          />
        ))}
      </div>
    </div>
  );
}
function determineColor (grade)
{
    if (grade >= 90) {return "green"}
    if (grade < 70) {return "red"}
}
function Student ({first = "John", last = "Doe", year="N/A", cou1="TBD", cou2="TBD", cou3="TBD", gra1="TBD", gra2="TBD", gra3="TBD"})
{
    return (
        <div className="stuDiv">
            <div className = "stuInfo">
            <h1 className = "name">{first} {last}</h1>
            <h2 className = "year">Year {year}</h2>
            </div>
            <div className = "couInfo">
                <p>Courses:</p>
                <ul className = "couList">
                    <li className = "couItem">
                        <div>{cou1}</div>
                        <div className={determineColor(gra1)}>
                            ({gra1})
                        </div>
                    </li>
                    <li className = "couItem">
                        <div>{cou2}</div>
                        <div className={determineColor(gra2)}>
                            ({gra2})
                        </div>
                    </li>
                    <li className = "couItem">
                        <div>{cou3}</div>
                        <div className={determineColor(gra3)}>
                            ({gra3})
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}


export default Students;
