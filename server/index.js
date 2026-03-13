const { createClient } = require("@supabase/supabase-js");
const express = require('express');
const cors = require('cors)');
const supaKey = "sb_publishable_wZ7Og9UpSIzd6u9AwS_AMg_U9LvEnUU";
const supaUrl = "https://byyqrzsfnteoqtxtjuhp.supabase.co";
const port = 8080;
const supabase = createClient(supaUrl, supaKey);
const students = loadStu();
const courses = loadCou();

async function loadStu()
{
    const { data, error } = await supabase.from("Students").select('*');

    if (data != null) {
        console.log("pre-existing student data acquired")
        return data;
    }
    else {console.log(error)}
    return;
}

async function loadCou()
{
    const { data, error } = await supabase.from("Courses").select('*');

    if (data != null) {
        console.log("pre-existing course data acquired")
        return data;
    }

    else {console.log(error)}
    return;
}

async function genStuID(first, last, year, house)
{
    let fir = (first.length<3?first:first.substring(0,3))
    let las = (last.length<5?last:last.substring(0,5))
    let yea = 29-year;
    let hou = house.substring(0,1);
    return (las+fir+yea+hou);
}

async function addSched(stuID, year)
{
    let arr = [];
    for (course in courses)
    {
        let yearLvl = course.CourseCode(0,1);
        if (yearLvl == year || yearLvl==year + 1)
        {
            arr.push(course);
        }
    }

    arr.sort( (a,b)=> a.StudentCount - b.StudentCount)
    let min = arr[0].StudentCount;
    let len = arr.length;
    for (let i = 3; i < len; i++)
    {
        if (arr[i].StudentCount > min)
        {
            arr.slice(i);
        }
    }
    len = arr.length;
    for (let j=1; j<=3; j++)
    {
        let index = Math.floor(Math.random()*len);
        courseNum = "Course" + (j+1);
        console.log(arr[index].CourseTitle)
        const { addErr } = await supabase
        .from('Schedules')
        .update({ [courseNum]: `${arr[index].CourseCode}` })
        .eq('StudentID', `${stuId}`)
        if (addErr){console.log(addErr)}
        arr.splice(index, 1);
        len = arr.length;
    }

    console.log("finished adding courses");
}

async function addStu (first, last, year)
{
    let arr = ['Badgerclaw','Talonscar','Slythaconda', 'Flyinlion'];
    let house = arr[Math.floor(Math.random() * 4)];
    let stuId = genStuId(first, last, year, arr[house]);
    const { error } = await supabase
    .from('Students')
    .insert({ StudentID: `${stuId}`, First: `${first}`, Last: `${last}`, Year: `${year}`, House: `${house}`});
    if (error){console.log(error)};
    return house;
}

async function addGrades(stuID)
{
    let grade1 = Math.round((60+Math.random()*40)*100)/100.00;
    let grade2 = Math.round((60+Math.random()*40)*100)/100.00;
    let grade3 = Math.round((60+Math.random()*40)*100)/100.00;
    const { error } = await supabase
    .from('Grades')
    .insert({ StudentID: `${stuId}`, Grade1: `${grade1}`, Grade2: `${grade2}`, Grade3: `${grade3}`});
    if (error){console.log(error)};
}
for (student in students)
{
    let stuID = genStuID(student.First, student.Last, student.Year, student.House);
    console.log(stuID + " vs " + student.StudentID)
    
    addSched(stuID, student.Year);
    addGrades(stuID);
}

const app = express();
app.use(cors);
app.use(express.json());
app.post('/students', (req,res)=>
{
    const stuData = req.body;

    let house = addStu(stuData.newFirst, stuData.newLast, stuData.newYear);
    let stuID = genStuID(stuData.newFirst, stuData.newLast, stuData.newYear, house);
    addSched(stuID, stuData.newYear);
    addGrades(stuID);
});

app.listen(port,()=>{console.log('server listening on port ', port)})