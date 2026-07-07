async function fetchDailyProblem() {
    try{
    let dailyProblem= await fetch("https://alfa-leetcode-api.onrender.com/Daily")
    console.log("api called for daily") 
    let problem = await dailyProblem.json()
    return problem  
    }
    catch(error){
        const popUpPath= "./frontend/error.html"
        chrome.action.setPopup({ popup: popUpPath });
        chrome.action.openPopup()
    }
     
}


async function fetchAcsubmissions() {
    try{
    let url = await getFromStorage("problem")
    let username = await getFromStorage("username")
    console.log(username)
    let solvedProblems = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/acsubmission`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache', // Prevents browser from using cached data
            'Pragma': 'no-cache'         // Fallback for older HTTP versions
        }
    });      
    console.log("api called for all submissions") 
    let submission = await solvedProblems.json()
    submission=submission.submission
    url=url.titleSlug
    console.log(url)
    console.log(submission)
    for(let i=0;i<20;i++){
        if(submission[i].titleSlug==url){
            console.log("solved")
            //updating total solved problems
            runOncePerDay(updateTotalProblems,'updateTotalProblems')
            return true
        }
    }
    console.log("not solved")
    return false
}
catch(error){
    const popUpPath= "./frontend/error.html"
    chrome.action.setPopup({ popup: popUpPath });
    chrome.action.openPopup()
}
    
}


async function removeRedirectRule() {
    let rules = await allDynamicRules()
    if (rules.length>0){
        try {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [200] // Ensure this ID corresponds to an existing rule
            });
            console.log("removed rule")
        }
        catch(error){
            console.log(error)
        }
    }
    }



async function addRedirectRule(){
    console.log("tryna remove rule")
    await removeRedirectRule()

    await new Promise((resolve) => setTimeout(resolve, 500)); // 100ms delay coz chromes api is slow
    console.log("after delay")
    let url = await getFromStorage("problem")
    console.log("this is the url in addredirectrule")
    console.log(url)
    url=url.questionLink
    if (url) {
        const redirectUrl = url;
        let redirectRule = {
            "id": 200, // Use a unique ID for this particular redirect rule so everytime u need to delete leetcode rule u delete rule with ID 200
            "priority": 1,
            "action": {
                "type": "redirect",
                "redirect": { "url": redirectUrl }
            },
            "condition": {
                "urlFilter": "*", // Match all URLs
                "resourceTypes": ["main_frame"]
            }
        };
     //Now add the new redirect rule
     await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [redirectRule]
    });
    console.log("Redirect rule updated successfully:", redirectUrl);

}
}


// Function that returns all current dynamic rules
async function allDynamicRules() {
    return await chrome.declarativeNetRequest.getDynamicRules()
}

// Helper to promisify chrome.storage.local.set
export const setInStorage = (key,data) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({[key]:data}, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
};


// Helper to promisify chrome.storage.local.get
export const getFromStorage = (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result[key]);
        });
    });
};


async function runOncePerDay(callback,storageKey) {
    const cutoff = new Date();
    cutoff.setHours(5, 35, 0, 0); // Set cutoff to 5:35 AM of the current day
    const cutoffTime = cutoff.getTime(); // Convert cutoff time to epoch time (milliseconds)

    const today = new Date();
    const todayTime = today.getTime(); // Convert today's time to epoch time (milliseconds)
    console.log("todayTime", todayTime);

    try {
        // Get the last run date from storage
        let localStorageKey='lastRunDate'+storageKey
        console.log(localStorageKey)
        const lastRunDate = await getFromStorage(localStorageKey);
        console.log("lastRunDate retrieved:", lastRunDate);

        // Check if lastRunDate exists and if it was already run after the cutoff
        if (lastRunDate) {
            const lastRunDateTime = new Date(lastRunDate).getTime(); // Convert lastRunDate to epoch time (milliseconds)
            if (lastRunDateTime > cutoffTime) {
                console.log("Function already ran today after cutoff." +storageKey);
                return null; // Skip the callback
            }
        }

        // Execute the callback
        const callbackResult = await callback();

        // Update the last run date in storage only if the callback was successful
        await setInStorage(localStorageKey, todayTime);
        console.log("Function executed successfully, and timestamp updated:", todayTime);

        return callbackResult; // Return the callback's result
    } catch (error) {
        console.error("Error in runOncePerDay:", error, callback);
        return null;
    }
}


async function updateTotalProblems(){
    let total = await getFromStorage("totalProblems")
    await setInStorage("totalProblems",total+1)
}

async function checker(){
    let isSolved = await fetchAcsubmissions()
    if(isSolved){
        await removeRedirectRule()
    }
}

//runs evrything on each new tab created
chrome.tabs.onCreated.addListener(async () => {
    console.log("on tab")
    let dailyProblem=await runOncePerDay(fetchDailyProblem,"fetchDailyProblem")
    console.log("dailt problem",dailyProblem)
    if(dailyProblem){
        await removeRedirectRule()
        setInStorage("problem",dailyProblem)
        
    }
    else{
        console.log("not gonna run daily")
    }
    await runOncePerDay(addRedirectRule,"addRedirectRule")
    let allRules = await allDynamicRules()
    let problem = await getFromStorage("problem")
    console.log(problem)
    console.log(allRules)
    console.log(allRules.length)
    if(allRules.length>0){
        console.log("not solved and rule exists so checker ran")
        await checker()
    }
    else{
        console.log("probem aldredy solved for today")
    }
    //setting popup to be the new one
    const popUpPath= await getFromStorage("popUpPath")
    if (popUpPath){
        chrome.action.setPopup({ popup: popUpPath });
    }
});


//prompts user to enter leetcode username
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.action.openPopup()
    } else if(details.reason == "update") {
        // perform some logic
    }
});

