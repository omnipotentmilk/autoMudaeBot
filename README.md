This branch contains the simple tampermonkey implementation of the autoMudaeBot

In order to set this up, follow these steps;
1. Download [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) from the chrome web store
2. Go to [chrome://extensions/](chrome://extensions/) and enable dev mode on the top right
3. Open and drag main.users.js onto the tampermonkey dashboard
4. Edit the file, update 'const guildId' and 'const channelId' with your desired serverID and channelID (These can be found by enabling developer mode on discord)
5. Open discord in the browser, ensure you are logged in, and refresh

You can verify it is working in a couple of ways;
1. In discord, after refreshing, open the developer console (A.K.A Inspect Element)
1A. Navigate to 'application' and search for 'botId' or 'botToken' in the 'localStorage' section
1B. You can also verify it is working by navigating to 'console', opening the console sidebar, clicking the 'users' section, and looking at console messages from 'userscript' showing the bot scanning messages

