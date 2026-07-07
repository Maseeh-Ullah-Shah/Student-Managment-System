const btn = document.querySelector("button");
const light = document.querySelector(".light");

btn.addEventListener("click",()=>{
    if(light.classList.toggle("active")){
        btn.textContent = "Off";
    }
    else{
        btn.textContent = "On"
    }
})
