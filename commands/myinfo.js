module.exports = {
  name: 'myinfo',
  description: 'Shows your user information',
  disabled: false,
  category: 'General',
  async execute(message, args, client) {
    const Discord = require('discord.js');
    const index = require('../index');

    if (!message.mentions.users.size && args[0]) {
      client.users.fetch(args[0]).then((user) => {
        return message.channel.send(`${args[0]}'s username is ${user.username}`);
      }).catch((err) => {
        console.log(err);
        return message.reply('Couldn\'t find a discord account with that id!');
      });
    } else if (!message.mentions.users.size) {
      let personName = message.member.displayName;
      let personID = message.member.id;
      return message.channel.send(`You're name is ${personName}. \nYou're ID is ${personID}.`);
    } else {
      const personInfoList = message.mentions.users.map(user => {
        return `${user.username}'s ID is ${user.id}`;
      });
      message.channel.send(personInfoList);  
    }
  }
}