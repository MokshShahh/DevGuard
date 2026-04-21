# DevGuard

DevGuard is a productivity browser extension that restricts web access until the daily LeetCode problem is completed. It serves as a commitment tool for developers to maintain their problem solving consistency.

## Features

- Redirects browser traffic to the daily LeetCode challenge.
- Resets redirection only after the problem is solved.
- Tracks the total number of problems solved through the extension.
- Integrates with the LeetCode API to monitor submission status.

## Installation

1. Clone this repository to your local machine.
2. Open Chrome and navigate to the extensions management page.
3. Enable Developer Mode.
4. Select Load unpacked and choose the project directory.

## Configuration

The extension requires a LeetCode username to verify problem completion. This username is requested during the initial setup.

## Technical Details

- Built with Chrome Extension Manifest V3.
- Utilizes the declarativeNetRequest API for traffic redirection.
- Stores user data and progress using local storage.
- Communicates with the LeetCode API for verification.
