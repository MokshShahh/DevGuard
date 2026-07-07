import { getFromStorage } from "../scripts/background.js";
console.log("problmes.js working")
//displaying total problmes solved for the user
let total=await getFromStorage("totalProblems")
document.getElementById("totalProblems").innerHTML=total