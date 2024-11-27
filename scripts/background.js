async function fetchDailyProblem() {
    let dailyProblem= await fetch("https://alfa-leetcode-api.onrender.com/Daily")
    console.log("api called for daily") 
    let problem = await dailyProblem.json()
    return problem   
}


async function fetchAcsubmissions(username) {
    let url = await getProblemFromStorage()
    let solvedProblems= await fetch("https://alfa-leetcode-api.onrender.com/MokshShahh/acsubmission")  
    console.log("api called for all submissions") 
    let submission = await solvedProblems.json()
    submission=submission.submission
    url=url.titleSlug
    console.log(url)
    console.log(submission)
    for(let i=0;i<20;i++){
        if(submission[i].titleSlug==url){
            console.log("solved")
            return true
        }
    }
    console.log("not solved")
    return false
    
}


async function removeRedirectRule() {
        try {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [200] // Ensure this ID corresponds to an existing rule
            });
        }
        catch(error){
            console.log(error)
        }
}


async function addRedirectRule(){
    removeRedirectRule()
    let url = await getProblemFromStorage()
    url=url.questionLink
    if (url) {
        const redirectUrl = url;
        let redirectRule = {
            "id": 200, // Use a unique ID for the new rule
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


// Function to log all current dynamic rules
async function logAllRules() {
    return await chrome.declarativeNetRequest.getDynamicRules()
}


async function runOncePerDay(callback,storageKey) {
    const cutoff = new Date();
    cutoff.setHours(5, 35, 0, 0); // Set cutoff to 5:35 AM of the current day
    const cutoffTime = cutoff.getTime(); // Convert cutoff time to epoch time (milliseconds)

    const today = new Date();
    const todayTime = today.getTime(); // Convert today's time to epoch time (milliseconds)
    console.log("todayTime", todayTime);

    // Helper to promisify chrome.storage.local.get
    const getFromStorage = (key) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key], (result) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve(result[key]);
            });
        });
    };

    // Helper to promisify chrome.storage.local.set
    const setInStorage = (key,data) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({[key]:data}, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    };

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
                console.log("Function already ran today after cutoff.");
                return null; // Skip the callback
            }
        }

        // Update the last run date and execute the callback
        await setInStorage( localStorageKey, todayTime );
        console.log("Function executed, and timestamp updated:", todayTime);
        return await callback();
    } catch (error) {
        console.error("Error in runOncePerDay:", error);
        return null;
    }
}


async function checker(){
    problem = await getProblemFromStorage()
    removeRedirectRule()
    let isSolved = await fetchAcsubmissions("Ji",problem)
    if(!isSolved){
        addRedirectRule()
    }
}

// Update problem in chrome.storage.local
async function setProblemInStorage(problem) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ 'problem': problem }, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

//retrieve probllem from storage
async function getProblemFromStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('problem', (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result.problem);
        });
    });
}

//runs everythign on start of chrome once
chrome.runtime.onStartup.addListener(async function() {
    dailyProblem=await runOncePerDay(fetchDailyProblem,"fetchDailyProblem")
    console.log("dailt problem",dailyProblem)
    if(dailyProblem){
        setProblemInStorage(dailyProblem)
        
    }
    else{
        console.log("not gonna run daily")
    }
    await runOncePerDay(addRedirectRule,"addRedirectRule")
    allRules = await logAllRules()
    let problem = await getProblemFromStorage()
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
    
  })


  //runs evrything on each new tab created
chrome.tabs.onCreated.addListener(async (tab) => {
    
    dailyProblem=await runOncePerDay(fetchDailyProblem,"fetchDailyProblem")
    console.log("dailt problem",dailyProblem)
    if(dailyProblem){
        setProblemInStorage(dailyProblem)
        
    }
    else{
        console.log("not gonna run daily")
    }
    await runOncePerDay(addRedirectRule,"addRedirectRule")
    allRules = await logAllRules()
    let problem = await getProblemFromStorage()
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
});


