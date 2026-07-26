const burger=document.getElementById("burger");

const sidebar=document.getElementById("sidebar");

burger.onclick=()=>{

sidebar.classList.toggle("active");

if(sidebar.classList.contains("active")){

burger.innerHTML="✕

";

}else{

burger.innerHTML="☰";

}

}
