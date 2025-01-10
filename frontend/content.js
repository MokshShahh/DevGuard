import { setInStorage } from "../scripts/background.js"

document.getElementById("next").addEventListener("click", async () => {
  let button = document.getElementById("next")
  button.disabled=true
    const username = document.getElementById("username").value
    if (username.trim() === "") {
        document.getElementById("error").innerHTML="Please enter valid username"
        button.disabled = false
        return;
      }
      let solvedProblems= await fetch(`https://alfa-leetcode-api.onrender.com/`+username)  
      let submission = await solvedProblems.json()
      console.log(submission)
      if (submission.errors){
        document.getElementById("error").innerHTML="Please enter valid username"
        button.disabled = false
        return;

      }
    //setting username in local storage so that it can be accessed by background.js
    await setInStorage("username",username)
    //setting total problems solved to be 0
    await setInStorage("totalProblems",0)
    //setting popup path to be total problems HTML file
    await setInStorage("popUpPath","./frontend/streak.html")
    // Set the popup to show the streak HTML file
    chrome.action.setPopup({ popup: "frontend/streak.html" }); 
    window.close();
  });
  