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
        return data.data.activeDailyCodingChallengeQuestion.link;
    } catch (error) {
        console.error("Network error:", error);
        return null;
    }
}

async function updateRedirectRule() {
    const url = await fetchDailyProblem();
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
            // First, remove the existing rule
            // await chrome.declarativeNetRequest.updateDynamicRules({
            //     removeRuleIds: [100] // Ensure this ID corresponds to an existing rule
            // });
            // console.log("Rule ID 100 removed successfully.");

            // Now add the new redirect rule
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

// Call the function to log all current dynamic rules
logAllRules();

// Call the function to update the redirect rule
updateRedirectRule().catch(error => console.error("Error in updateRedirectRule:", error));
