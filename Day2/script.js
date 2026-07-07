const input = document.querySelector("input");
const add = document.querySelector(".add");

const todolist = document.querySelector(".todo-list");
let editingElement = null;
let index = null;
const tasks = JSON.parse(localStorage.getItem("userTask")) || [];

ui();

function ui() {
     todolist.innerHTML = "";
  tasks.forEach((task,position) => {
  
    
      todolist.innerHTML += `<div class="li">
                <h3>${task.text}</h3>
                <div class="buttons">
                    <button class="btn edit" onclick = "edit(this,${position})">Edit</button>
                    <button class="btn del" onclick = "del(event,${position})">Delete</button>
                </div>
            </div>`;
  });
}

add.addEventListener("click", () => {
     console.log(index);
    if(input.value === "") return;
    else if(index!==null){
        tasks.splice(index,1,{text:input.value});
        input.value = "";
        index = null;
        localStorage.setItem("userTask",JSON.stringify(tasks));
        ui();
    }
    else{
        tasks.push({ text: input.value });
        localStorage.setItem("userTask",JSON.stringify(tasks));
        ui();
    }
});
function del(event,index) {
  tasks.splice(index,1);
  localStorage.setItem("userTask",JSON.stringify(tasks));
  ui();
}
function edit(button,position) {
    index = position;
    input.value = tasks[index].text;
}
