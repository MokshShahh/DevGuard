let problem
async function fetchDailyProblem() {
    let dailyProblem= await fetch("https://alfa-leetcode-api.onrender.com/Daily")
    let problem = await dailyProblem.json()
    return problem   
}


async function fetchAcsubmissions(username,url) {
    let solvedProblems= await fetch("https://alfa-leetcode-api.onrender.com/MokshShahh/acsubmission")   
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


async function addRedirectRule(url){
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
    try {
        const rules = await chrome.declarativeNetRequest.getDynamicRules();
        console.log("Current dynamic rules:", rules);
    } catch (error) {
        console.error("Error retrieving dynamic rules:", error);
    }
}

async function runOncePerDay(callback) {
    const today = new Date().toISOString().split('T')[0]; // Get the current date (YYYY-MM-DD)

    // Retrieve the last run date from Chrome storage
    chrome.storage.local.get(['lastRunDate'], (result) => {
        const lastRunDate = result.lastRunDate;

        // Check if the function has already run today
        if (lastRunDate === today) {
            console.log("Function already ran today.");
            return null;
        }
        // Store the current date as the last run date
        chrome.storage.local.set({ lastRunDate: today }, () => {
            console.log("Function executed, and timestamp updated:", today);
        });
        
    });
    return await callback();
}


async function checker(){
    removeRedirectRule()
    let isSolved = await fetchAcsubmissions("Ji",problem)
    if(!isSolved){
        addRedirectRule(problem)
    }
}


// Call the function to log all current dynamic rules
logAllRules();
problem = fetchDailyProblem()
chrome.tabs.onCreated.addListener(async (tab) => {
    dailyProblem=await runOncePerDay(fetchDailyProblem)
    if(dailyProblem){
        problem=dailyProblem
    }
    else{
        console.log("not gonna run daily")
    }
    
    await checker()
    console.log("checker ran")
});


