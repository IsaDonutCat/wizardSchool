const { createClient } = require("@supabase/supabase-js");
const http = require('http');
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
    for (let j=0; j<3; j++)
    {}
}

for (student in students)
{
    let stuID = genStuID(student.First, student.Last, student.Year, student.House);
    console.log(stuID + " vs " + student.StudentID)
    
    addSched(stuID, student.Year);
}
