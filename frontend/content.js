import {setInStorage} from "../scripts/background.js"

document.getElementById("next").addEventListener("click", async () => {
    const username = document.getElementById("username").value
    if (username.trim() === "") {
        document.getElementById("error").innerHTML="Please enter valid username"
        return;
      }
    //setting username in local storage so that it can be accessed bu background.js
    await setInStorage("username",username)
    await setInStorage("popUpPath","./frontend/streak.html")
    // Set the popup to show the streak HTML file
    chrome.action.setPopup({ popup: "frontend/streak.html" }); 
    window.close();
  });
  