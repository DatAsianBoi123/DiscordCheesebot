const Discord = require('discord.js');
const prefix = process.env.prefix;
const client = new Discord.Client();

const help1 = `PREFIX - ${prefix} \n\nhelp - shows this help page (${prefix}help [help page number]) \n\ninfo - shows server info (${prefix}info) \n\nmyinfo - shows a users info (${prefix}myinfo [@user]) \n\nping - Pong! (${prefix}ping) \n\npig - Oink! (${prefix}pig) \n\nskycrypt / sc - shows a player's https://sky.shiiyu.moe (${prefix}skycrypt / sc <player name> [profile name]) \n\npog - displays a pog emote (${prefix}pog <pog name>) \n\nsource - shows the source code for Aspect Of The Cheesebot (${prefix}source)`;
const help2 = `mybucks - Shows the amount of bucks this user has (${prefix}mybucks [@user]) \n\nbucklist - Shows everyone's burgis bucks on this server (${prefix}bucklist)`;
var reqs = '50k slayer xp\n20mil net worth\nSkill avg of at least 18.5\nActive at least once a week unless u have a good excuse';
var PollID;
var BurgisBucks = {};
var ShopList = [];
var CostList = [];

let embedHelp1 = new Discord.MessageEmbed()
    .setTitle('General Commands')
    .setDescription(help1)
    .setFooter('1/2')
    .setColor('RED');
let embedHelp2 = new Discord.MessageEmbed()
    .setTitle('Burgis Buck Commands')
    .setDescription(help2)
    .setFooter('2/2')
    .setColor('ORANGE');

client.once('ready', () => {
    console.log('Ready');
    client.user.setActivity('b.help');
    client.users.cache.get('721020694493790330').send('Ready');
});

client.on('message', async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.mentions.users.size) {
        if (message.mentions.users.first().username === "Aspect Of The Cheesebot") {
            message.channel.send(embedHelp1);
        }
    }

    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    switch(command) {
        case 'help': {
            if (args[0] === "2") return message.channel.send(embedHelp2);
            message.channel.send(embedHelp1);
            break;
        }

        case 'kick': {
            let member = message.mentions.members.first();
            if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You do not have permission to use this command!");
            if (member === undefined) return message.reply(`Incorrect command format! \n(${prefix}kick <@user>)`);

            if (!member.hasPermission('ADMINISTRATOR') || message.member.roles.cache.some(role => role.name === 'Head Asian') && !(member.roles.cache.some(role => role.name === 'Guild Master'))) member.kick().then((member) => {
                message.channel.send(member.displayName + " has been kicked.");
            }); else message.channel.send('Cannot kick this member!');

            break;
        }

        case 'ban': {
            let member = message.mentions.members.first();
            if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("You do not have permission to use this command!");
            if (member === undefined) return message.reply(`Incorrect command format! \n(${prefix}ban <@user>)`);

            if (!member.hasPermission('ADMINISTRATOR') || message.member.roles.cache.some(role => role.name === 'Head Asian') && !(member.roles.cache.some(role => role.name === 'Guild Master'))) member.ban().then((member) => {
                message.channel.send(member.displayName + " has been banned.");
            }); else message.channel.send('Cannnot ban this member!');

            break;
        }

        case 'mute': {
            const member = message.mentions.members.first();
            const role = message.guild.roles.cache.find(role => role.name === 'MUTED');

            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            if (member === undefined) return message.reply(`Incorrect command format! \n(${prefix}mute <@user>)`);

            if (!member.hasPermission('ADMINISTRATOR') || message.member.roles.cache.some(role => role.name === 'Head Asian') && !(member.roles.cache.some(role => role.name === 'Guild Master'))) {
                member.roles.add(role).catch(err => {
                    return message.channel.send('An error occured');
                });
                message.channel.send(`${member.displayName} has been muted.`);
            } else message.channel.send('Cannot mute this member!');

            break;
        }

        case 'unmute': {
            const member = message.mentions.members.first();
            const role = message.guild.roles.cache.find(role => role.name === 'MUTED');

            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            if (member === undefined) return message.reply(`Incorrect command format! \n(${prefix}mute <@user>)`);

            if (!member.hasPermission('ADMINISTRATOR') || message.member.roles.cache.some(role => role.name === 'Head Asian') && !(member.roles.cache.some(role => role.name === 'Guild Master'))) {
                member.roles.remove(role).catch(err => {
                    return message.channel.send('An error occured');
                });
                message.channel.send(`${member.displayName} has been unmuted.`);
            } else message.channel.send('Cannot mute this member!');

            break;
        }

        case 'info': {
            let embedInfo = new Discord.MessageEmbed()
                .setTitle('Server Info:')
                .setDescription(`Server name: ${message.guild.name} \nTotal members: ${message.guild.memberCount}`)
                .setColor('ORANGE');
            message.channel.send(embedInfo);

            break;
        }

        case 'ping': {
            message.channel.send("Pong!");

            break;
        }

        case 'pig': {
            message.channel.send('Oink!');

            break;
        }

        case 'myinfo': {
            if (!message.mentions.users.size) {
                let personName = message.member.displayName;
                let personID = message.member.id;
                return message.channel.send(`You're name is ${personName}. \nYou're ID is ${personID}.`);
            }

            const personInfoList = message.mentions.users.map(user => {
                return `${user.username}'s ID is ${user.id}`;
            });
            message.channel.send(personInfoList);

            break;
        }

        case 'd':
        case 'delete': {
            let deleteNumber = Math.floor(parseFloat(args[0]));

            if (isNaN(parseInt(args[0]))) return message.reply(`Incorrect command format! \n(${prefix}delete <amount>)`);
            if (parseInt(deleteNumber) > 99) return message.reply("You cannot delete more than 99 messages at a time!");
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have permission to use this command!");

            message.channel.bulkDelete(parseInt(deleteNumber) + 1).then(() => {
                if (args[1] == "true" || args[1] == null) {
                    if (parseInt(deleteNumber) == 1) message.channel.send(`Successfully deleted \`\`${parseInt(deleteNumber)}\`\` message!`);
                    else message.channel.send(`Successfully deleted \`\`${parseInt(deleteNumber)}\`\` messages!`);
                }
            }).catch(err => {
                message.reply('An error occured (You can only delete messages that are under 14 days old)');
            });

            break;
        }

        case 'dm': {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            if (!args[1]) return message.reply(`Incorrect command format! \n(${prefix}dm <@user> <message>)`);

            let sendSuccess = true;
            let dmMessage = args.slice(1).join(' ');
            client.users.cache.get(args[0]).send(dmMessage).catch(err => {
                message.reply('Cannot send messages to this person!');
                sendSuccess = false;
                return;
            });

            setTimeout(() => {
                if (sendSuccess == true) message.channel.send(`Successfully DM'd ${args[0]} ${dmMessage}!`);
            }, 500);

            break;
        }

        case 'source': {
            message.channel.send('Here is my source code! \nhttps://github.com/DatAsianBoi123/DiscordCheesebot');

            break;
        }

        case 'sc':
        case 'skycrypt': {
            if (!args[0]) return message.reply(`Incorrect command format! \n(b.skylea <player name> [profile name])`);
            if (!args[1]) message.channel.send(`https://sky.shiiyu.moe/stats/${args[0]}`);
            else message.channel.send(`https://sky.shiiyu.moe/stats/${args[0]}/${args[1]}`);

            break;
        }

        case 'pog': {
            if (!args[0]) return message.reply(`Incorrect command format! \n(b.pog <pog name>)`);

            switch (args[0]) {
                case 'gator': {
                    let gatormsg = await message.channel.send('<:GatorPOG:761662766393589770>');
                    await gatormsg.react(':GatorPOG:761662766393589770');

                    message.delete().catch(err => {
                        return;
                    });

                    break;
                }

                case 'triangle': {
                    let trianglemsg = await message.channel.send('<:TrianglePOG:761668890572226611>');
                    await trianglemsg.react(':TrianglePOG:761668890572226611');

                    message.delete().catch(err => {
                        return;
                    });

                    break;
                }

                case 'shaggy': {
                    let shaggymsg = await message.channel.send('<:ShaggyPOG:761672749667975208>');
                    await shaggymsg.react(':ShaggyPOG:761672749667975208');

                    message.delete().catch(err => {
                        return;
                    });

                    break;
                }

                case 'imposter': {
                    let impostermsg = await message.channel.send('<:ImpostorPOG:762163842473000981>');
                    await impostermsg.react(':ImpostorPOG:762163842473000981');

                    message.delete().catch(err => {
                        return;
                    });

                    break;
                }

                case 'list': {
                    let embedPog = new Discord.MessageEmbed()
                        .setTitle('List of pogs:')
                        .setDescription('gator \ntriangle \nshaggy \nimposter')
                        .setColor('#F0630F');

                    message.channel.send(embedPog);

                    break;
                }

                default: {
                    message.reply(`Pog ${args[0]} doesn't exist!`);
                }
            }

            break;
        }

        //Requirements

        case 'requirements':
        case 'reqs': {
            let embedReqs = new Discord.MessageEmbed()
                .setTitle('Guild Requirements:')
                .setDescription(reqs)
                .setFooter('Make sure to DM a staff member to check if you meet the requirements!')
                .setColor('#0CE1F3');

            message.channel.send(embedReqs);

            break;
        }

        case 'changerequirements':
        case 'changereqs': {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            message.channel.send('What should the requirements be?');
            message.channel.awaitMessages(m => m.author.id == message.author.id, {
                max: 1, time: 10000
            }).then(collected => {
                reqs = collected.first().content;
                message.channel.send(`Successfully set the guild requirements to ${reqs}!`);
            }).catch(err => {
                message.reply('No reply in 10 seconds, resetting requirements');
            });

            break;
        }

        case 'resetrequirements':
        case 'resetreqs': {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            reqs = 'No reqs for now!';

            break;
        }

        //Burgis Bucks

        case 'mybucks': {
            if (!message.mentions.users.size) {
                if (!(message.author.username in BurgisBucks)) BurgisBucks[`${message.author.username}`] = 0;
                return message.reply("you have " + BurgisBucks[`${message.author.username}`] + " burgis bucks.");
            }

            const personBuckList = message.mentions.users.map(user => {
                if (!(user.username in BurgisBucks)) BurgisBucks[`${user.username}`] = 0;
                return `${user.username} has ` + BurgisBucks[`${user.username}`] + " burgis bucks.";
            });
            message.channel.send(personBuckList);

            break;
        }

        case 'addbucks': {
            let addNumber = parseFloat(args[0]);
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply("You do not have permission to use this command!");

            if (isNaN(parseInt(args[0]))) return message.reply(`Incorrect command format! \n${prefix}addbucks <amount> [@user]`);
            if (Math.sign(args[0]) == 1) addNumber = Math.floor(addNumber);
            else if (Math.sign(args[0]) == -1) addNumber = Math.ceil(addNumber);
            else return message.reply('Please use a number greater or equal to 1.');

            if (!message.mentions.users.size) {
                if (!(message.author.username in BurgisBucks)) BurgisBucks[`${message.author.username}`] = 0;
                if (!message.mentions.users.size) {
                    if (Number.isInteger(parseInt(addNumber))) message.channel.send(`Successfully added ${parseInt(addNumber)} burgis bucks in your account!`);
                    else return message.channel.reply('An error occured');
                    return BurgisBucks[`${message.author.username}`] += parseInt(addNumber);
                }
            }

            const personBuckAddList = message.mentions.users.map(user => {
                if (!(user.username in BurgisBucks)) BurgisBucks[`${user.username}`] = 0;

                let AddBuckMsg = ' ';
                if (!args[1]) return message.reply(`Incorrect command format! \n(${prefix}addbucks <integer> [@user])`);

                if (Number.isInteger(parseInt(addNumber))) AddBuckMsg = `Successfully added ${parseInt(addNumber)} burgis bucks in ${user.username}'s account!`;
                else return message.reply("An error occured");

                BurgisBucks[`${user.username}`] += parseInt(addNumber);
                return AddBuckMsg;
            });

            message.channel.send(personBuckAddList).catch(err => {
                return;
            });

            break;
        }

        case 'bucklist': {
            let BuckOrder = 0;
            let BuckMessage = '';
            for (let keys in BurgisBucks) {
                let name = `${Object.keys(BurgisBucks)[BuckOrder]}: `;
                let amount = `${BurgisBucks[keys]}\n`;

                BuckMessage += name + amount;
                BuckOrder ++;
            }
            let embedBucks = new Discord.MessageEmbed()
                .setTitle('Burgis Buck List:')
                .setDescription(BuckMessage)
                .setColor('PURPLE');

            message.channel.send(embedBucks);

            break;
        }

        case 'resetbucks': {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            if (!args[0]) message.reply(`Incorrect command format! \n(${prefix}resetbucks <@user>)`);

            message.mentions.users.map(user => {
                if (!(user.username in BurgisBucks)) return;
                BurgisBucks[user.username] = 0;
                message.channel.send(`Successfully set ${user.username}'s bucks to 0!`);
            });

            break;
        }

        case 'addshop': {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            if (!args[2] || isNaN(parseInt(args[2])) || !message.mentions.channels.first()) return message.reply(`Incorrect command format! \n(${prefix}addshop <title> <#channel> <cost> <description>`);

            let shopDesc = args.slice(3).join(' ');
            let chan = message.mentions.channels.first();
            let embedShop = new Discord.MessageEmbed()
                .setTitle('Burgis Shop:')
                .setDescription(`Shop Title: ${args[0]} \n\nShop Description: ${shopDesc} \n\nCost: ${args[2]} burgis bucks`)
                .setFooter(`Command: ${prefix}buy ${args[0]}`)
                .setColor('BLUE');

            ShopList.push(args[0]);
            CostList.push(args[2]);
            chan.send(embedShop);

            break;
        }

        case 'deleteshop': {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            if (!args[0]) return message.reply(`Incorrect command format! \n(${prefix}deleteshop <shop title>)`);

            for (let i = 0; i <= ShopList.length; i ++) {
                if (args[0] == ShopList[i]) {
                    ShopList.splice(i, 1);
                    return message.channel.send(`Successfully deleted shop ${args[0]}!`);
                }
            }
            message.reply(`It seems like shop ${args[0]} doesn't exist. Double check if you typed it correctly(it is case sensitive)!`);

            break;
        }

        case 'shops': {
            let shops = '';

            for (let i = 0; i < ShopList.length; i ++) {
                shops += `Name: ${ShopList[i]}, Cost: ${CostList[i]} \n`;
            }

            let embedShop = new Discord.MessageEmbed()
                .setTitle('All Shops:')
                .setDescription(shops)
                .setColor('GREEN');

            if (ShopList.length == 0) return message.reply(`It seems like there are no currect active shops!`);
            message.channel.send(embedShop);

            break;
        }

        case 'buy': {
            if (!args[0]) return message.reply(`Incorrect command format! \n(${prefix}buy <shop title>)`);

            for (let i = 0; i <= ShopList.length; i ++) {
                if (ShopList[i] == args[0]) return message.channel.send(`You just bought ${ShopList[i]}!`);
                else return message.reply(`It seems like shop ${args[0]} doesn't exist. Double check if you typed it correctly(it is case sensitive)!`);
            }

            break;
        }

        case 'deleteshop': {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            if (!args[0]) return message.reply(`Incorrrect command format! \n(${prefix}deleteshop <shop title>)`);

            for (let i = 0; i <= ShopList.length; i ++) {
                if (ShopList[i] == args[0]) {
                    ShopList.splice(i, 1);
                    CostList.splice(i, 1);
                    message.channel.send(`You just deleted shop ${ShopList[i]}!`);
                    return;
                }
                else return message.reply(`It seems like shop ${args[0]} doesn't exist. Double check if you typed it correctly(it is case sensitive)!`);
            }

            break;
        }

        //Poll Commands

        case 'addpoll': {
            let channelName = message.mentions.channels.first();

            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            if (!args[1]) return message.reply('Incorrect command format! \n(b.addpoll <#channel> <poll>');
            if (channelName == undefined) return message.reply('Incorrect command format! \n(b.addpoll <#channel> <poll>');

            let embedPoll = new Discord.MessageEmbed()
                .setTitle('Poll:')
                .setDescription(args.slice(1).join(' '))
                .setColor('YELLOW');

            if (PollID != undefined) {
                channelName.send(`<@&${PollID}>`);
            }
            let msg = await channelName.send(embedPoll).catch((error) => {
                return message.reply('An error occured');
            });
            await msg.react(':upvote:758527296071794718');
            await msg.react(':downvote:758527282532319263');

            break;
        }

        case 'changepollid': {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
            if (isNaN(parseInt(args[0]))) return message.reply('Incorrect command format! \n(b.changepollid <role ID>)');
            PollID = args[0];
            message.channel.send('Successfully set the poll role ID!');

            break;
        }

        case 'resetpollid': {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');

            PollID = undefined;
            message.channel.send('Successfully reset the poll role ID!');

            break;
        }

        default: {
            if (command == '') return;
            message.reply(`This command (${command}) does not exist!`);

            break;
        }
    }
});

client.login(process.env.token);
