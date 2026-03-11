const { createClient } = require("@supabase/supabase-js");
const http = require('http');
const supaKey = "sb_publishable_wZ7Og9UpSIzd6u9AwS_AMg_U9LvEnUU";
const supaUrl = "https://byyqrzsfnteoqtxtjuhp.supabase.co";
const port = 8080;

async function sortStu() {

   const supabase = createClient(supaUrl, supaKey);
   const stuData = await supabase.from("Students").select('*');
   console.log(stuData)
for (const student of stuData.data)
{
   console.log(student);
   const year = student.Year;
   const stuId = student.StudentID;
   const totCouData = [];
   const couData = await supabase
  .from('Courses')
  .select('CourseCode')
  .like('CourseCode', `${year}%`);
  couData.data.forEach((str)=> (totCouData.push(str)));
  const couDataPlus = await supabase
  .from('Courses')
  .select('CourseCode')
  .like('CourseCode', `${year+1}%`);
   couDataPlus.data.forEach((str)=> (totCouData.push(str)));
   const len = totCouData.length;
   let courseNum = ""
   console.log("start adding courses")
   for (let i = 0; i <len; i++)
   {  
      let courseData = totCouData;
      let ranNum = Math.floor(Math.random()*courseData.length);
      console.log(courseData[ranNum].CourseCode + " "+ courseData[i].CourseCode)
      courseNum = "Course" + (i+1);
      const { addErr } = await supabase
      .from('Schedules')
      .update({ [courseNum]: `${courseData[ranNum].CourseCode}` })
      .eq('StudentID', `${stuId}`)
      courseData.splice(ranNum, 1);
      if (i ==2)
      {
         break;
      }
   }
      let test = await supabase
      .from('Schedules')
      .select()
      .eq('StudentID', `${stuId}`)
      console.log(test.data)
   }
   console.log ("finished")
}

function addStu()
{
   console.log("Hello World");
   return;
};
const PORT = 3000;
const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // Send the response body as 'Hello, World!'
  res.end('Hello, World!\n');
});
// Define the port to listen on const PORT = 3000;
// Start the server and listen on the specified port
server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});