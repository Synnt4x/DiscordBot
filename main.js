/**
 * A bot based on the following repo from 'y15':
 * https://gist.github.com/y21/a599ef74c8746341dbcbd32093a69eb8
 */

// load your credentials stored in a separate file
var loginCreds = require('../Credentials/credentials.json');

// Import the discord.js module
const { Client, Intents } = require('discord.js');

// Get all intents and create an instance of a Discord client
//const client = new Client({ ws: { intents: Intents.ALL } });
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] }, { ws: { intents: Intents.ALL } });

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    var date = new Date().toLocaleString();
    console.log('LegendBot is ready! - ' + date);
    // Set a game activity for the bot
    client.user.setActivity("LegendBot | !help");
});

// The keys in this map represent the roles defined on your discord server
var arrayOfRoles = { ApexPlayers: '!addRole:apex', ValorantPlayers: '!addRole:valorant', AmongUsPlayers: '!addRole:amongus', MinecraftPlayers: '!addRole:minecraft', 'CS:GOPlayers': '!addRole:cs', RocketLeague: '!addRole:rl', SpellBreakers: '!addRole:spell', WarzonePlayers: '!addRole:warzone' };


// Create an event listener for messages
client.on('message', message => {
    lowerCaseMessage = message.content.toLowerCase();
    // TODO - Regex for all letters after '!'
    /* var letters = /^[a-zA-Z]+$/;
    if (lowerCaseMessage === '!'){
      console.log(message.member.user.username + " tried to get a non existing role - at least on this server");

      // Used to get my own user id
      //console.log(message.member.user.id);
      client.users.get("316514645752020992").send(message.content);

      message.channel.send("I'm sorry " + message.member.user.username + "!\n Unfortunately there is no command/role like this yet... but I requested it from our admins :)\n").catch((e) => { console.log(e); });
      return;
    } */

    // If the message is "ping"
    if (lowerCaseMessage === '!ping') {
        // Send "pong" to the same channel
        message.channel.send('Pong!').catch((e) => { console.log(e); });
        console.log('Ping from: ' + message.member.user.username);
    }

    if (lowerCaseMessage === '!cmds' || lowerCaseMessage === '!help') {
        var channelLink = message.member.guild.channels.cache.find(channel => channel.name === '🤖bot-commands');
        // Print all existing commands
        message.reply('Hey you! \nI only understand certain commands. Here is a list of them: \n-> "**!roles**" - shows a list of all available roles \n-> "**!sounds**" - shows a list of all soundsnippets \nGo ahead and try it yourself under the channel <#' + channelLink + '> \n\n *Of course you can remove a role yourself using the following pattern:* "**!rmRole:apex**"').catch((e) => { console.log(e); });
    }

    if (lowerCaseMessage === '!roles') {
        // Print all existing roles
        message.channel.send('These are the available roles: \n- **!addRole:apex** | ApexPlayers \n- **!addRole:valorant** | ValorantPlayers \n- **!addRole:amongus** | AmongUsPlayers \n- **!addRole:minecraft** | MinecraftPlayers \n- **!addRole:cs** | CS:GOPlayers \n- **!addRole:rl** | RocketLeague \n').catch((e) => { console.log(e); });
        //message.guild.roles.findAll
    }


    // Function for getting roles //
    // -------------------------- //
    function addingRole(roleToAdd) {
        // Filter the rolename of the whole !addrole request out
        var roleName = roleToAdd.split(':', 2);
        var role = null;
        // Cycle through the predefined role array
        for (var key in arrayOfRoles) {
            // If the given role name matches an entry of the predefined role array it will further execute
            if (roleToAdd === arrayOfRoles[key].toLowerCase()) {
                // Get role id from the discord guild
                var role = message.guild.roles.cache.find(role => role.name === key);

                if (role === null) {
                    console.log(message.member.user.username + ' tried to get a non existing role (' + roleName[1] + ') - atleast on this server');
                    var adminRoleLink = guild.roles.cache.find(channel => channel.name === 'Admin');
                    message.reply('Hm...it seems that I know this role but this server does not... ' + adminRoleLink + '-Team haaalp!').catch((e) => { console.log(e); });
                    return;
                }

                message.channel.send('You requested the role: ' + role.name + '...').catch((e) => { console.log(e); });
                var strpd_role = role.toString().replace(/\D/g, "");

                // Check if member has role
                if (message.member.roles.cache.has(strpd_role)) {
                    console.log(message.member.user.username + ' already has the role: ' + role.name);
                    message.reply('NANI?!... you already have the role: ' + role.name).catch((e) => { console.log(e); });
                } else {
                    message.member.roles.add(role);
                    console.log(message.member.user.username + ' added himself the role: ' + role.name);
                    message.reply('Have fun with your new role! :)').catch((e) => { console.log(e); });
                }
            }
        }
    }

    // Listening for the addrole command
    if (lowerCaseMessage.startsWith('!addrole:')) {
        try {
            addingRole(lowerCaseMessage);
        } catch (error) {
            console.log('Unknown input for adding role: ' + message);
        }
    }


    // Function for removing roles //
    // -------------------------- //
    function removingRole(roleToRemove) {
        // Filter the rolename of the whole !rmrole request out
        var roleName = roleToRemove.split(':', 2);
        var role = null;
        // Cycle through the predefined role array
        for (var key in arrayOfRoles) {
            // When removing a role we can also use our predefined role array. But this time we need to split the vlaue field and check for accordance.
            var arrayKeySplit = arrayOfRoles[key].split(':', 2);
            // If the given role name matches an entry of the predefined role array it will further execute
            if (roleName[1] === arrayKeySplit[1].toLowerCase()) {
                // Get role id from the discord guild
                role = message.guild.roles.cache.find(role => role.name === key);
            }
        }
        if (role === null) {
            console.log(message.member.user.username + ' tried to remove the role >' + roleName[1] + '< but failed somehow!');
            message.reply('This server doesn\'t know this role...').catch((e) => { console.log(e); });
            return;
        }
        var strpd_role = role.toString().replace(/\D/g, "");

        // Check if member has role
        if (message.member.roles.cache.has(strpd_role)) {
            message.member.roles.remove(role);
            console.log(message.member.user.username + ' removed himself the role: ' + role.name);
            message.reply('I removed the role ' + role.name + ' from you.\n*...sad bot noises...*').catch((e) => { console.log(e); });
        } else {
            console.log(message.member.user.username + ' tried to remove a role he doesn\'t own: ' + role.name);
            message.reply('You can\'t remove a role you don\'t own!').catch((e) => { console.log(e); });
        }
    }

    // Listening for the rmrole command
    if (lowerCaseMessage.startsWith('!rmrole:')) {
        try {
            removingRole(lowerCaseMessage);
        } catch (error) {
            console.log('Unknown input for removing role: ' + message);
        }
    }


    // Routine for MP3 Snippets //
    // ------------------------- //
    // REMEMBER adding 1s of silence at the end of each file, because the bot is leaving the channel too early
    const soundsFolder = './SoundSnippets/';
    const fs = require('fs');
    if (message.content.startsWith('/')) {
        // Voice only works in guilds
        if (!message.guild) return;
        try {
            // Remove the / from the message and add the .mp3 ending
            var concatMsg = lowerCaseMessage.concat('.mp3').slice(1);
            var pathToFile = soundsFolder.concat(concatMsg);
            var vc = message.member.voice.channel;

            // Iterate over snippets
            fs.readdir(soundsFolder, (err, files) => {
                files.forEach(file => {
                    if (file === concatMsg) {
                        // Only try to join the sender's voice channel if they are in one themselves
                        if (vc) {
                            vc.join().then(connection => {
                                const dispatcher = connection.play(pathToFile, { volume: 0.5, });
                                dispatcher.on('finish', () => {
                                    vc.leave();
                                    console.log('Finished playing: ' + concatMsg);
                                });
                            });
                        } else {
                            message.reply('You need to join a voice channel first!');
                        }
                    }
                });
            });
        } catch (error) {
            console.log('Unknown input for sound snippets: ' + message);
        }
    }

    // Display all available sound snippets
    if (lowerCaseMessage === '!sounds') {
        message.reply('Try playing a snippet by typing "**/**_filename_" \nHere are the available sounds:\n').catch((e) => { console.log(e); });
        var sounds = [];
        // Iterate over snippets
        fs.readdir(soundsFolder, (err, files) => {
            files.forEach(file => {
                sounds.push('- ' + file.split(".", 1));
            });
            message.channel.send(sounds).catch((e) => { console.log(e); });
            message.channel.send('_May I suggest you to try_ **/click**').catch((e) => { console.log(e); });
        });
    }
});

client.on('messageReactionAdd', async(reaction, user) => {
    // Function for getting reaction roles //
    // -------------------------- //
    function addReactionRole(roleToAdd) {
        // Filter the rolename of the whole !addrole request out
        var roleName = roleToAdd.split(':', 2);
        var role = null;
        // Cycle through the predefined role array
        for (var key in arrayOfRoles) {
            // If the given role name matches an entry of the predefined role array it will further execute
            if (roleToAdd === arrayOfRoles[key].toLowerCase()) {
                // Get role id from the discord guild
                var role = reaction.message.guild.roles.cache.find(role => role.name === key);

                if (role === null) {
                    console.log(reaction.message.member.user.username + ' tried to get a non existing role (' + roleName[1] + ') - atleast on this server');
                    return;
                }

                var strpd_role = role.toString().replace(/\D/g, "");

                // Check if member has role
                if (reaction.message.member.roles.cache.has(strpd_role)) {
                    console.log(reaction.message.member.user.username + ' already has the role: ' + role.name);
                } else {
                    reaction.message.member.roles.add(role);
                    console.log(reaction.message.member.user.username + ' added himself the role: ' + role.name);
                }
            }
        }
    }

    // When we receive a reaction we check if the reaction is partial or not
    // TODO: Channel ID Anpassen und Emoji Namen bzw Emojis dem Server hinzufügen
    constChannelName = '734850972479782986';
    if (reaction.message.channel.id === constChannelName) {
        // console.log('Listening on (add) reactions in the correct channel');
    }
    try {
        await reaction.fetch();
        // TODO: Für jede Rolle copy pasten
        if (reaction.emoji.name === 'apex') {
            console.log('Give reaction role: Apex');
            addReactionRole('!addrole:apex');
        } else if (reaction.emoji.name === 'csgo') {
            console.log('Give reaction role: CS:GO');
            addReactionRole('!addrole:cs');
        } else if (reaction.emoji.name === 'valorant') {
            console.log('Give reaction role: Valorant');
            addReactionRole('!addrole:valorant');
        } else if (reaction.emoji.name === 'amongus') {
            console.log('Give reaction role: Among Us');
            addReactionRole('!addrole:amongus');
        } else if (reaction.emoji.name === 'minecraft') {
            console.log('Give reaction role: Minecraft');
            addReactionRole('!addrole:minecraft');
        } else if (reaction.emoji.name === 'rocketleague') {
            console.log('Give reaction role: Rocket League');
            addReactionRole('!addrole:rl');
        }
    } catch (error) {
        console.error('Something went wrong when fetching the message: ', error);
        return;
    }
});

client.on('messageReactionRemove', async(reaction, user) => {
    // Function for removing reaction roles //
    // -------------------------- //
    function removingReactionRole(roleToRemove) {
        // Filter the rolename of the whole !rmrole request out
        var roleName = roleToRemove.split(':', 2);
        var role = null;
        // Cycle through the predefined role array
        for (var key in arrayOfRoles) {
            // When removing a role we can also use our predefined role array. But this time we need to split the vlaue field and check for accordance.
            var arrayKeySplit = arrayOfRoles[key].split(':', 2);
            // If the given role name matches an entry of the predefined role array it will further execute
            if (roleName[1] === arrayKeySplit[1].toLowerCase()) {
                // Get role id from the discord guild
                role = reaction.message.guild.roles.cache.find(role => role.name === key);
            }
        }
        if (role === null) {
            console.log(reaction.message.member.user.username + ' tried to remove the role >' + roleName[1] + '< but failed somehow!');
            return;
        }

        var strpd_role = role.toString().replace(/\D/g, "");

        // Check if member has role
        if (reaction.message.member.roles.cache.has(strpd_role)) {
            reaction.message.member.roles.remove(role);
            console.log(reaction.message.member.user.username + ' removed himself the role: ' + role.name);
        } else {
            console.log(reaction.message.member.user.username + ' tried to remove a role he doesn\'t own: ' + role.name);
        }
    }

    // When we receive a reaction we check if the reaction is partial or not
    // TODO: Channel ID Anpassen und Emoji Namen bzw Emojis dem Server hinzufügen
    constChannelName = '734850972479782986';
    if (reaction.message.channel.id === constChannelName) {
        // console.log('Listening on (remove) reactions in the correct channel');
    }
    try {
        await reaction.fetch();
        // TODO: Für jede Rolle copy pasten
        if (reaction.emoji.name === 'apex') {
            console.log('Remove reaction role: Apex');
            removingReactionRole('!rmrole:apex');
        } else if (reaction.emoji.name === 'csgo') {
            console.log('Remove reaction role: CS:GO');
            removingReactionRole('!addrole:cs');
        } else if (reaction.emoji.name === 'valorant') {
            console.log('Remove reaction role: Valorant');
            removingReactionRole('!addrole:valorant');
        } else if (reaction.emoji.name === 'amongus') {
            console.log('Remove reaction role: Among Us');
            removingReactionRole('!addrole:amongus');
        } else if (reaction.emoji.name === 'minecraft') {
            console.log('Remove reaction role: Minecraft');
            removingReactionRole('!addrole:minecraft');
        } else if (reaction.emoji.name === 'rocketleague') {
            console.log('Remove reaction role: Rocket League');
            removingReactionRole('!addrole:rl');
        }
    } catch (error) {
        console.error('Something went wrong when fetching the message: ', error);
        return;
    }
});

// Greet all new members
client.on('guildMemberAdd', (member) => {
    var guild = member.guild;
    //var memberTag = member.user.tag;
    var name = member.user.username;
    var id = member.user.id;

    if (guild.systemChannel) {
        /* guild.systemChannel.send(new Discord.RichEmbed() // Creating instance of Discord.RichEmbed
        .setTitle("A new user joined") // Calling method setTitle on constructor.
        .setDescription(memberTag + " has joined the guild") // Setting embed description
        .setThumbnail(member.user.displayAvatarURL) // The image on the top right; method requires an url, not a path to file!
        .addField("Members now", member.guild.memberCount) // Adds a field; First parameter is the title and the second is the value.
        .setTimestamp() // Sets a timestamp at the end of the embed
        ); */
        console.log('The user: ' + name + ' joined the Server');

        const channelHow = guild.channels.cache.find(channel => channel.name === '❔how-to');
        const channelBot = guild.channels.cache.find(channel => channel.name === '🤖bot-commands');
        //var adminLink = guild.roles.cache.find(role => role.name === 'Admin');
        //guild.systemChannel.send('Hello <@' + id + '>, nice to meet you! \nIf you want **to communicate with the others** (writing in textchannels) **you will need a role**, you can add it yourself in the <#' + channelBot + '> channel with the command "!addrole:rolename". \nTo learn more about all this futuristic stuff and our rules **checkout**: <#' + channelHow + '>, as well as the **pinned messages** in each of our textchannels, those provide you with all kinds of useful information to navigate on our server. :) \nTo checkout all of our bot commands you can just type "**!help**". \nIf you need any further help or if you have suggestions for improvement contact our <@&' + adminLink + '>-Team.').catch((e) => { console.log(e); });
        guild.systemChannel.send('Hello <@' + id + '>, nice to meet you! \nUsing a role on this server is **inevitable**, you can add it yourself in the <#' + channelBot + '> channel with the command "!addrole:rolename". \nPlease read our rules: <#' + channelHow + '>, as well as the **pinned messages** in each of our text channels. :) \nTo check out all of our bot commands you can just type "**!help**".').catch((e) => { console.log(e); });
    }
});

// Log our bot in by using the token from https://discordapp.com/developers/applications/me
client.login(loginCreds.token);