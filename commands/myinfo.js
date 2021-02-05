module.exports = {
  name: 'myinfo',
  description: 'Shows your user information',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    const index = require('../index');

    if (!message.mentions.users.size && args[0]) {
      const user = client.users.cache.get(args[0]);
      if (!user) return message.channel.send('Couldn\'t find the user with that id!');
      return message.channel.send(`${args[0]}'s name is ${user.username}`);
    } else if (!message.mentions.users.size) {
      let personName = message.member.displayName;
      let personID = message.member.id;
      return message.channel.send(`You're name is ${personName}. \nYou're ID is ${personID}.`);
    }

    const personInfoList = message.mentions.users.map(user => {
      return `${user.username}'s ID is ${user.id}`;
    });
    message.channel.send(personInfoList);
  }
}