const form = document.querySelector("form");

const name = document.querySelector("#name");
const age = document.querySelector("#age");
const course = document.querySelector("#course");
const addBtn = document.querySelector(".add-btn");

const students = document.querySelector(".students");
const totalStudents = document.querySelector("#total-students");

const search = document.querySelector("#search");
//To add student data
// 1).first i made an empty aray to store student information.
let studentsInfo = JSON.parse(localStorage.getItem("studentsData")) || [];
// 2).i made a ui function to made a ui.
//3).for editing i declared a temporary variable index.
let editIndex = null;
//4).To count totl number of students i declared a variable .
let count = 0;
function ui(studentArray) {
  students.innerHTML = "";
  studentArray.forEach((elem, index) => {
    students.innerHTML += `<div class="student-card">
          <div class="details">
            <h2>${elem.name}</h2>
            <p><strong>Age:</strong> ${elem.age}</p>
            <p><strong>Course:</strong> ${elem.course}</p>
          </div>
          <div class="buttons">
            <button class="edit" onclick = "edit(${index})">Edit</button>
            <button class="delete" onclick = "del(${index})">Delete</button>
          </div>
        </div>`;
  });
}

ui(studentsInfo);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (
    name.value.trim() === "" &&
    age.value.trim() === "" &&
    course.value.trim() === ""
  )
    return;
  else if (editIndex !== null) {
    studentsInfo[editIndex].name = name.value;
    studentsInfo[editIndex].age = age.value;
    studentsInfo[editIndex].course = course.value;
    editIndex = null;
    localStorage.setItem("studentsData", JSON.stringify(studentsInfo));
  } else {
    count++;
    totalStudents.textContent = count;
    studentsInfo.push({
      name: name.value,
      age: age.value,
      course: course.value,
    });
    localStorage.setItem("studentsData", JSON.stringify(studentsInfo));
  }
  // 3).to clear the form use
  form.reset();
  ui(studentsInfo);
});
let edit = (index) => {
  name.value = studentsInfo[index].name;
  age.value = studentsInfo[index].age;
  course.value = studentsInfo[index].course;
  editIndex = index;
};
let del = (index) => {
  count--;
  totalStudents.textContent = count;
  studentsInfo.splice(index, 1);
  localStorage.setItem("StudentsData", JSON.stringify(studentsInfo));
  ui(studentsInfo);
};
search.addEventListener("input", () => {
  const value = search.value.trim().toLowerCase();
  if (value === "") ui(studentsInfo);
  else {
    let filterArray = studentsInfo.filter((student) =>
        student.name.toLowerCase().includes(value) ||
        student.course.toLowerCase().includes(value) ||
        student.age.toString().includes(value),
    );
    if (filterArray.length == 0) {
      students.innerHTML = "<h2>No student found</h2>";
      return;
    }
    ui(filterArray);
  }
});
