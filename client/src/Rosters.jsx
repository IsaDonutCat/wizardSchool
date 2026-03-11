const supaKey = "sb_publishable_wZ7Og9UpSIzd6u9AwS_AMg_U9LvEnUU";
const supaUrl = "https://byyqrzsfnteoqtxtjuhp.supabase.co";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
const supabase = createClient(supaUrl, supaKey);

function Rosters() {
    const [students, setStudents] = useState(new Map());
      const [schedules, setSchedules] = useState(new Map());
      const [courses, setCourses] = useState([]);
      const [search, setSearch] = useState('');
      const [filteredData, setFilteredData] = useState([]);
      const [grades, setGrades] = useState(new Map());
      useEffect(()=>
      {
        getStudents();
        getSchedules();
        getGrades();
      },[]);
    
      useEffect(()=>{getCourses();},
      [schedules,students,grades]);
      useEffect(() => {
      getFilteredData();
      }, [search, schedules, courses, students,grades]);

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
        setCourses(data);
    }

    async function getSchedules() {
        const { data } = await supabase.from("Schedules").select();
        const newMap = new Map(); // Cloning the Map to keep immutability
        for (const obj of data)
        {newMap.set(obj.StudentID, obj)};
        setSchedules(newMap); // Updating the state
    }
    
        function getFilteredData()
        {
          console.log(search)
          let newData = [];
          newData = courses.filter((obj) => 
            {
              let couName = obj.CourseTitle;
              return (couName.toLowerCase().includes(search.toLowerCase()))
            }
          );
        setFilteredData(newData);
        }

        function generateRoster(courseCode)
        {
          let roster = [];
          schedules.entries(schedules).forEach(([key, value]) => {
            let first = students.get(key).First;
            let last = students.get(key).Last;
            let full = first + " " + last;
            if (value.Course1 == courseCode)
            {
              console.log(full, courseCode, grades.get(key).Grade1);
              let grade = grades.get(key).Grade1;
              roster.push({stuName: full, stuGrade: grade});
                          console.log(full, courseCode);

            }
            else if (value.Course2 == courseCode)
            {
              console.log(full, courseCode, grades.get(key).Grade2);
              let grade = grades.get(key).Grade2;
              roster.push({stuName: full, stuGrade: grade});
            console.log(full, courseCode);

            }
            else if (value.Course3 == courseCode)
            {
              console.log(full, courseCode, grades.get(key).Grade3);
              let grade = grades.get(key).Grade3;
              roster.push({stuName: full, stuGrade: grade});
            console.log(full, courseCode);

            }
          });
          console.log(roster);
          return roster;
        }
        return (
          <div className ='courses'>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search here"/>
            <div>
              {filteredData.map((courses) => (

                <Course couName={courses.CourseTitle} roster={generateRoster(courses.CourseCode)}/>
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

function Course ({couName = "TBA", roster = []})
{
  return (
  <div className="course">
    <h1>{couName}</h1>
    <ul>
      {roster.map((obj)=>(
        <li>
          <div>{obj.stuName}</div>
          <div className={determineColor=(obj.stuGrade)}>{obj.stuGrade}</div>
        </li>))}
    </ul>
  </div>
  );
}
export default Rosters;