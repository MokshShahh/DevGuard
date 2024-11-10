async function fetchDailyProblem() {
    const query = `
        query getDailyProblem {
            activeDailyCodingChallengeQuestion {
                date
                link
                question {
                    questionId
                    questionFrontendId
                    title
                    titleSlug
                    difficulty
                    isPaidOnly
                    contributors {
                        username
                        profileUrl
                        avatarUrl
                    }
                    topicTags {
                        name
                        slug
                        translatedName
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // You might need to add Authorization headers here if required
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        if (data.errors) {
            console.error("Error fetching daily problem:", data.errors);
            return null;
        }
        return data.data.activeDailyCodingChallengeQuestion;
    } catch (error) {
        console.error("Network error:", error);
        return null;
    }
}

async function fetchAcsubmissions(username) {
    let solvedProblems= await fetch("https://alfa-leetcode-api.onrender.com/Arnav_58/acsubmission")
    
    let submission = await solvedProblems.json()
    submission=submission.submission
    let url = await fetchDailyProblem();
    url=url.question.titleslug
    for(let i=0;i<20;i++){
        if(submission[i].titleslug==url){
            return true
        }
    }
    
}

async function updateRedirectRule() {
    let url = await fetchDailyProblem();
    url=url.link
    if (url) {
        const redirectUrl = 'https://leetcode.com' + url;
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

        try {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [200] // Ensure this ID corresponds to an existing rule
            });
            

            //Now add the new redirect rule
            await chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [redirectRule]
            });
            console.log("Redirect rule updated successfully:", redirectUrl);
        } catch (error) {
            console.error("Error updating redirect rules:", error);
        }
    } else {
        console.error("Failed to get daily problem URL.");
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

// Call the function to update the redirect rule
async function runOncePerDay(callback) {
    const today = new Date().toISOString().split('T')[0]; // Get the current date (YYYY-MM-DD)

    // Retrieve the last run date from Chrome storage
    chrome.storage.local.get(['lastRunDate'], (result) => {
        const lastRunDate = result.lastRunDate;

        // Check if the function has already run today
        if (lastRunDate === today) {
            console.log("Function already ran today.");
            return;
        }

        // If not, run the function and update the timestamp
        callback();

        // Store the current date as the last run date
        chrome.storage.local.set({ lastRunDate: today }, () => {
            console.log("Function executed, and timestamp updated:", today);
        });
    });
}

async function checker(){
    if(fetchAcsubmissions("ji")){
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [200] // Ensure this ID corresponds to an existing rule
        });
        console.log("removed rule coz solved")
    }
}
// Call the function to log all current dynamic rules
logAllRules();
chrome.tabs.onCreated.addListener((tab) => {
    checker()
    runOncePerDay(updateRedirectRule)
    console.log("checker ran")
});


