// ==UserScript==
// @name         autoMudaeBot
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Interacts with the discord API to send messages, commands, and reactions
// @match        https://discord.com/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==


(async function() {


    // $#$#$#$#$#$#$#$# Config $#$#$#$#$#$#$#$#


    // Safe to customize
    const guildId = '820071400580710410'; // Right click server icon
    const channelId = '1307807273359249569'; // Right click channel 
    const delayMs = 2000; // Delay between sending individual requests
    const delayScanMs = 10000; // Delay between scanning for all requests
    const messageScanLimit = 50;
    const emoji = "%E2%9D%A4%EF%B8%8F";

    // Dev
    const mudaeId = '432610292342587392';
    let botToken, botId, sessionId = null;


    // $#$#$#$#$#$#$#$# Get Token and SessionID $#$#$#$#$#$#$#$#


    async function aggregateData() {
        return new Promise((resolve, reject) => {
            try {
                botToken = localStorage.getItem('token');
                botId = localStorage.getItem('user_id_cache');
                botToken = botToken.slice(1, -1);
                botId = botId.slice(1, -1);
                localStorage.setItem('botToken', botToken);
                localStorage.setItem('botId', botId);
            } catch (error) {
                console.warn('error', error);
                try {
                    botToken = localStorage.getItem('botToken');
                    botId = localStorage.getItem('botId');
                } catch (errror) {
                    reject('Failed to retrieve botToken and botId');
                }
            }
            const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
            ws.onopen = () => {
                let payload = {
                    op: 2,
                    d: {
                        token: botToken,
                        properties: {
                            $os: 'linux',
                            $browser: 'discord.js',
                            $device: 'discord.js'
                        },
                        compress: false,
                        large_threshold: 250
                    }
                }
                ws.send(JSON.stringify(payload));
            }
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.t === 'READY') {
                    sessionId = data.d.session_id;
                    ws.close();
                    resolve(sessionId);
                }
            }
            ws.onerror = (error) => {
                console.warn('error:', error);
                reject('WebSocket error occurred');
            }
        });
    }
    await aggregateData();


    // $#$#$#$#$#$#$#$# JSON body data $#$#$#$#$#$#$#$#


    const jsonBodyStorage = {
        sendCommand: {
            type: 2,
            application_id: mudaeId,
            guild_id: guildId,
            channel_id: channelId,
            session_id: sessionId,
            data: {
                version: null,
                id: null,
                name: null
            }
        },
        sendDaily: {
            type: 2,
            application_id: mudaeId,
            guild_id: guildId,
            channel_id: channelId,
            session_id: sessionId,
            data: {
                version: '947059341406638110',
                id: '946747833032261662',
                name: 'daily',
                type: 1
            }
        },
        sendRollRefresh: {
            type: 2,
            application_id: mudaeId,
            guild_id: guildId,
            channel_id: channelId,
            session_id: sessionId,
            data: {
                version: '947059384368902154',
                id: '946748685444853810',
                name: 'rolls',
                type: 1
            }
        },
        sendGift: {
            type: 2,
            application_id: mudaeId,
            guild_id: guildId,
            channel_id: channelId,
            session_id: sessionId,
            data: {
                version: '1014441849785700373',
                id: '1014441849785700372',
                name: 'collection',
                type: 1,
                options: [
                    {
                        type: 1,
                        name: 'give',
                        options: [
                            {
                                type: 3,
                                name: 'input',
                                value: null //  <@${userId}> ${characterName}
                            }
                        ]
                    }
                ]
            }
        },
        sendTu: {
            type: 2,
            application_id: mudaeId,
            guild_id: guildId,
            channel_id: channelId,
            session_id: sessionId,
            data: {
                version: '832171928072224790',
                id: '832171928072224789',
                name: 'tu',
                type: 1
            }
        },
        sendDk: {
            type: 2,
            application_id: mudaeId,
            guild_id: guildId,
            channel_id: channelId,
            session_id: sessionId,
            data: {
                version: '946747875541549107',
                id: '946747875541549106',
                name: 'dk',
                type: 1
            }
        },
        sendKakera: {
            type: 2,
            application_id: mudaeId,
            guild_id: guildId,
            channel_id: channelId,
            session_id: sessionId,
            data: {
                version: '1019186105926557787',
                id: '802903167343001620',
                name: 'kakera',
                type: 1,
                options: [
                    {
                        type: 1,
                        name: 'givek',
                        options: [
                            {
                                type: 3,
                                name: 'input',
                                value: null // '<@${userId}> ${amount}'
                            }
                        ]
                    }
                ]
            }
        },
        sendMmk: {
            type: 2,
            application_id: mudaeId,
            guild_id: guildId,
            channel_id: channelId,
            session_id: sessionId,
            data: {
                version: '946748429479080017',
                id: '946748429479080016',
                name: 'mm',
                type: 1,
                options: [
                    {
                        type: 3,
                        name: 'input',
                        value: '/k='
                    }
                ]
            }
        },
        sendChat: {
            content: null,
            tts: false,
            flags: 0
        },
    }
    const rollDataStorage = {
        ha: {
            version: "832172457028747337",
            command_id: "832172457028747336",
            name: "ha"
        },
        hg: {
            version: "832172416192872459",
            command_id: "832172416192872458",
            name: "hg"
        },
        hx: {
            version: "832172373536669707",
            command_id: "832172373536669706",
            name: "hx"
        },
        ma: {
            version: "832172599823958027",
            command_id: "832172599823958026",
            name: "ma"
        },
        mg: {
            version: "832172640105922571",
            command_id: "832172640105922570",
            name: "mg"
        },
        mx: {
            version: "832172721650663456",
            command_id: "832172721650663455",
            name: "mx"
        },
        wa: {
            version: "832172151729422418",
            command_id: "832172151729422417",
            name: "wa"
        },
        wg: {
            version: "832172216665374751",
            command_id: "832172216665374750",
            name: "wg"
        },
        wx: {
            version: "832172261968314389",
            command_id: "832172261968314388",
            name: "wx"
        }
    }
    const urlStorage = {
        channelRequest: `https://discord.com/api/v9/channels/${channelId}/messages?limit=${messageScanLimit}`,
        sendInteraction: 'https://discord.com/api/v9/interactions',
        sendMessage: `https://discord.com/api/v9/channels/${channelId}/messages`,
        sendEmoji: `https://discord.com/api/v9/channels/${channelId}/messages/${null}/reactions/${emoji}/@me`,//message ID from mudae
        deleteEmoji: `https://discord.com/api/v9/channels/${channelId}/messages/${null}/reactions/${emoji}/0/@me`//message ID
    }
    const headerStorage = {
        authorization: {
            Authorization: botToken,
            'Content-Type': 'application/json'
        },
    }


    // $#$#$#$#$#$#$#$# Misc $#$#$#$#$#$#$#$#


    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function matchNumber(input) { // Used to clamp roll numbers to between 1-8
        return {
            isValid: ['1', '2', '3', '4', '5', '6', '7', '8'].includes(input),
        };
    }

    function generateUrl(baseUrl, replacement) { // Properly configures fetch(); urls
        return baseUrl.replace('null', replacement);
    }

    function findMatchingNames(input, characterList) { // Finding which rolled character to claim
        function normalizeString(str) {
            str = str.replace(/[aeiouáàãâäéèêëíìîïóòôöõúùûüýÿ]/g, '#');
            str = str.replace(/[-]/g, ' ');
            str = str.replace(/[\(\)\.]/g, '')
            str = str.split(' ');
            return str;
        }
        function compareStrings(arrayA, arrayB) {
            for (let a of arrayA) {
                for (let b of arrayB) {
                    if (a === b) {
                        return true;
                    }
                }
            }
            return false;
        }
        let output = {
            isFound: false,
            mudaeMessageId: null
        }
        input = normalizeString(input);
        for (const character of characterList) {
            const modifiedCharacterName = normalizeString(character.characterName);
            if (compareStrings(modifiedCharacterName, input)) {
                output.isFound = true;
                output.mudaeMessageId = character.mudaeMessageId;
                break;
            }
        }
        return output;
    }

    class buffer {
        constructor() {
            this.maxSize = 50;
            this.data = [];
        }
        append(item) {
            if (this.data.length >= this.maxSize) {
                this.data.shift();
            }
            this.data.push(item);
        }
        contains(item) {
            if (this.data.includes(item)) {
                return true;
            } else {
                return false;
            }
        }
    }


    // $#$#$#$#$#$#$#$# Chat Scraper $#$#$#$#$#$#$#$#


    async function fetchMessages() {
        try {
            const response = await fetch(urlStorage.channelRequest, {
                method: 'GET',
                headers: headerStorage.authorization,
            });
            if (response.ok) {
                const messages = await response.json();
                return messages;
            }
        } catch (error) {
            return []; // return empty array if fail to get messages
        }
    }


    // $#$#$#$#$#$#$#$# Message Parser $#$#$#$#$#$#$#$#


    async function parseMessages(rawDiscordMessages) {
        let requests = [];
        let characters = [];

        rawDiscordMessages.forEach((message) => {
            if ((message.content.startsWith(`<@${botId}>`)) || (message.content.startsWith(`@bot`)) || (message.content.startsWith(`@bots`))) {
                let content = message.content;
                content = content.split(' ').slice(1).join(' ');
                content = content.toLowerCase();
                let data = content.split(' ');
                let type = data.shift();
                type = type.toLowerCase();
                data = data.join(' ');
                data = data.toLowerCase();
                let isValid = true;
                let request = {
                    type: type,
                    messageId: message.id,
                    author: message.author.id
                }
                switch (true) {
                    case content.startsWith('gift'):
                    case content.startsWith('claim'):
                        if (!data || data.trim() === '') {
                            isValid = false;
                            break;
                        } else {
                            request.character = data;
                            break;
                        }
                    // 'a' animaga | 'g' game | 'h' husbando | 'w' waifu | 'm' any | 'x' either game or animaga
                    case content.startsWith('kakera'):
                        if (!data || data.trim() === '') {
                            isValid = false;
                            break;
                        } else {
                            request.amount = data;
                            break;
                        }
                    case content.startsWith('ha'):
                    case content.startsWith('hg'):
                    case content.startsWith('hx'):
                    case content.startsWith('wa'):
                    case content.startsWith('wg'):
                    case content.startsWith('wx'):
                    case content.startsWith('ma'):
                    case content.startsWith('mg'):
                    case content.startsWith('mx'):
                        request.amount = data;
                    case content.startsWith('tu'):
                    case content.startsWith('dk'):
                    case content.startsWith('daily'):
                    case content.startsWith('mmk'):
                        break;
                    default:
                        isValid = false;
                        break;
                }
                if (isValid) {
                    requests.push(request);
                }
            } else if (message.author.id === mudaeId) {
                if (message.embeds && message.embeds.length > 0) {
                    const embed = message.embeds[0];
                    const description = embed.description || "";
                    if (description.includes('React with any emoji to claim!')) {
                        const characterName = (embed.author?.name || 'Unknown character').toLowerCase();
                        characters.push({
                            mudaeMessageId: message.id,
                            characterName: characterName,
                        });
                    }
                }
            }
        });
        let output = {
            requests: requests,
            characters: characters
        }
        return output;
    }


    // $#$#$#$#$#$#$#$# Request Handler $#$#$#$#$#$#$#$#


    let processedRequests = new buffer();
    async function parseRequests(requests, characterList){
        let commands = [];
        for (const request of requests) {
            if (!(processedRequests.contains(request.messageId))){
                let isValidCommand = false;
                let temp = {};
                switch(request.type) {
                    case 'claim':
                        temp = findMatchingNames(request.character, characterList);
                        if (temp.isFound) {
                            request.mudaeMessageId = temp.mudaeMessageId;
                            request.emoji = emoji;
                            isValidCommand = true;
                        } else {
                            isValidCommand = false;
                        }
                        break;
                    // 'a' animaga | 'g' game | 'h' husbando | 'w' waifu | 'm' any | 'x' either game or animaga
                    case 'ha':
                    case 'hg':
                    case 'hx':
                    case 'wa':
                    case 'wg':
                    case 'wx':
                    case 'ma':
                    case 'mg':
                    case 'mx':
                        temp = matchNumber(request.amount);
                        if (temp.isValid) {
                            isValidCommand = true;
                        } else {
                            request.amount = 1;
                            isValidCommand = true;
                        }
                        break;
                    case 'gift':
                    case 'dk':
                    case 'tu':
                    case 'kakera':
                    case 'daily':
                    case 'mmk':
                        isValidCommand = true;
                        break;
                    default:
                        isValidCommand = false;
                        break;
                }
                if (isValidCommand) {
                    commands.push(request);
                }
                processedRequests.append(request.messageId);
            }
        }
        return commands;
    }


    // $#$#$#$#$#$#$#$# Command Sender $#$#$#$#$#$#$#$#


    async function sendCommand(command) {
        let url = null;
        let urlAlt = null;
        let jsonBody = null;
        let jsonBodyAlt = null;
        switch (command.type) {
            case 'claim':
                url = await generateUrl(urlStorage.sendEmoji, command.mudaeMessageId);
                urlAlt = await generateUrl(urlStorage.deleteEmoji, command.mudaeMessageId);
                break;
            case 'kakera':
                urlAlt = await generateUrl(urlStorage.sendMessage);
            default:
                url = await generateUrl(urlStorage.sendInteraction);
                break;
        }
        switch (command.type) {
            case 'tu':
                jsonBody = await structuredClone(jsonBodyStorage.sendTu);
                break;
            case 'dk':
                jsonBody = await structuredClone(jsonBodyStorage.sendDk);
                break;
            case 'mmk':
                jsonBody = await structuredClone(jsonBodyStorage.sendMmk);
                break;
            case 'gift':
                jsonBody = await structuredClone(jsonBodyStorage.sendGift);
                jsonBody.data.options[0].options[0].value = `<@${command.author}> ${command.character}`;
                break;
            case 'daily':
                jsonBody = await structuredClone(jsonBodyStorage.sendDaily);
                jsonBodyAlt = await structuredClone (jsonBodyStorage.sendRollRefresh);
                break;
            case 'claim':
                jsonBody = {
                    note: 'Type "claim" does not have a JSON body'
                }
                break;
            case 'ha':
                jsonBody = await structuredClone(jsonBodyStorage.sendCommand);
                jsonBody.data.version = rollDataStorage.ha.version;
                jsonBody.data.id = rollDataStorage.ha.command_id;
                jsonBody.data.name = command.type;
                break;
            case 'hg':
                jsonBody = await structuredClone(jsonBodyStorage.sendCommand);
                jsonBody.data.version = rollDataStorage.hg.version;
                jsonBody.data.id = rollDataStorage.hg.command_id;
                jsonBody.data.name = command.type;
                break;
            case 'hx':
                jsonBody = await structuredClone(jsonBodyStorage.sendCommand);
                jsonBody.data.version = rollDataStorage.hx.version;
                jsonBody.data.id = rollDataStorage.hx.command_id;
                jsonBody.data.name = command.type;
                break;
            case 'ma':
                jsonBody = await structuredClone(jsonBodyStorage.sendCommand);
                jsonBody.data.version = rollDataStorage.ma.version;
                jsonBody.data.id = rollDataStorage.ma.command_id;
                jsonBody.data.name = command.type;
                break;
            case 'mg':
                jsonBody = await structuredClone(jsonBodyStorage.sendCommand);
                jsonBody.data.version = rollDataStorage.mg.version;
                jsonBody.data.id = rollDataStorage.mg.command_id;
                jsonBody.data.name = command.type;
                break;
            case 'mx':
                jsonBody = await structuredClone(jsonBodyStorage.sendCommand);
                jsonBody.data.version = rollDataStorage.mx.version;
                jsonBody.data.id = rollDataStorage.mx.command_id;
                jsonBody.data.name = command.type;
                break;
            case 'wa':
                jsonBody = await structuredClone(jsonBodyStorage.sendCommand);
                jsonBody.data.version = rollDataStorage.wa.version;
                jsonBody.data.id = rollDataStorage.wa.command_id;
                jsonBody.data.name = command.type;
                break;
            case 'wg':
                jsonBody = await structuredClone(jsonBodyStorage.sendCommand);
                jsonBody.data.version = rollDataStorage.wg.version;
                jsonBody.data.id = rollDataStorage.wg.command_id;
                jsonBody.data.name = command.type;
                break;
            case 'wx':
                jsonBody = await structuredClone(jsonBodyStorage.sendCommand);
                jsonBody.data.version = rollDataStorage.wx.version;
                jsonBody.data.id = rollDataStorage.wx.command_id;
                jsonBody.data.name = command.type;
                break;
            case 'kakera':
                jsonBody = await structuredClone(jsonBodyStorage.sendKakera);
                jsonBody.data.options[0].options[0].value = `<@${command.author}> ${command.amount}`;
                jsonBodyAlt = await structuredClone(jsonBodyStorage.sendChat);
                jsonBodyAlt.content = 'y';
                break;
            default:
                break;
        }
        let headers = headerStorage.authorization;
        let temp = 0;
        switch (command.type){
            case 'claim':
                while (temp < 1) {
                    try {
                        const response = await fetch(url, {
                            method: 'PUT',
                            headers
                        });
                        if (response.status === 429) {
                            const payload = await response.json();
                            const cooldown = payload.retry_after * 1500;
                            await delay(cooldown);
                            temp--;
                            continue;
                        }
                    } catch (error) {
                    }
                    await delay(delayMs);
                    try {
                        const response = await fetch(urlAlt, {
                            method: 'DELETE',
                            headers,
                        });
                        if (response.status === 429) {
                            const payload = await response.json();
                            const cooldown = payload.retry_after * 1500;
                            await delay(cooldown);
                            temp--;
                            continue;
                        }
                    } catch (error) {
                    }
                    temp++;
                }
                break;
            case 'kakera':
                while (temp < 1) {
                    try {
                        let response = await fetch(url, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(jsonBody)
                        });
                        if (response.status === 429) {
                            const payload = await response.json();
                            const cooldown = payload.retry_after * 1500;
                            await delay(cooldown);
                            temp--;
                            continue;
                        }
                        await delay (delayMs);
                        response = await fetch(urlAlt, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(jsonBodyAlt)
                        });
                        if (response.status === 429) {
                            const payload = await response.json();
                            const cooldown = payload.retry_after * 1500;
                            await delay(cooldown);
                            temp--;
                            continue;
                        }
                    } catch (error) {
                    }
                    temp++;
                }
                break;
            case 'daily':
                while (temp < 1) {
                    try {
                        let response = await fetch(url, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(jsonBody)
                        });
                        if (response.status === 429) {
                            const payload = await response.json();
                            const cooldown = payload.retry_after * 1500;
                            await delay(cooldown);
                            temp--;
                            continue;
                        }
                        await delay (delayMs);
                        response = await fetch(url, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(jsonBodyAlt)
                        });
                        if (response.status === 429) {
                            const payload = await response.json();
                            const cooldown = payload.retry_after * 1500;
                            await delay(cooldown);
                            temp--;
                            continue;
                        }
                    } catch (err) {
                    }
                    temp++;
                }
                break;
            case 'ha':
            case 'hg':
            case 'hx':
            case 'wa':
            case 'wg':
            case 'wx':
            case 'ma':
            case 'mg':
            case 'mx':
                while (temp < (command.amount)) {
                    await delay(delayMs);
                    try {
                        const response = await fetch(url, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(jsonBody)
                        });
                        if (response.status === 429) {
                            const payload = await response.json();
                            const cooldown = payload.retry_after * 1500;
                            await delay(cooldown);
                            temp--;
                            continue;
                        }
                    } catch (err) {
                    }
                    temp++;
                }
                break;
            default:
                while (temp < 1) {
                    try {
                        const response = await fetch(url, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(jsonBody)
                        });
                        if (response.status === 429) {
                            const payload = await response.json();
                            const cooldown = payload.retry_after * 1500;
                            await delay(cooldown);
                            temp--;
                            continue;
                        }
                    } catch (err) {
                    }
                    temp++;
                }
                break;
        }
    }


    // $#$#$#$#$#$#$#$# Control Flow $#$#$#$#$#$#$#$#


    while (true){
        let rawDiscordMessages = await fetchMessages();
        console.log('Raw scraped messages:', rawDiscordMessages);
        await delay(delayMs);

        let filteredRequestsAndCharacters = await parseMessages(rawDiscordMessages);
        console.log('Filtered requests and characters:', filteredRequestsAndCharacters);

        let preparedCommands = await parseRequests(filteredRequestsAndCharacters.requests, filteredRequestsAndCharacters.characters);
        console.log('Commands prepared:', preparedCommands);

        preparedCommands.reverse();
        for (const command of preparedCommands){
            await sendCommand(command);
            await delay(delayMs);
        }

        await delay(delayScanMs);//cooldown between cycles
    }

})();