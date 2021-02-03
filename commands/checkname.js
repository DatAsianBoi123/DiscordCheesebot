module.exports = {
  name: 'checkname',
  description: 'Checks if a minecraft username is available or not',
  disabled: false,
  category: 'Misc.',
  async execute(message, args) {
    const Discord = require('discord.js');
    const fetch = require('node-fetch');
    const index = require('../index');

    let json;
    if (!args[0]) return message.reply(`Incorrect command format! \n(${index.prefix}checkname <name>)`);

    let embedVerification;

    let nameAPI = async () => {
      let result = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`);
      json = result.json().catch(() => {
        json = undefined;
        embedVerification = new Discord.MessageEmbed()
          .setTitle('Name not found')
          .setDescription('It seems like this minecraft account does not exist!')
          .setColor('RED');
        return message.channel.send(embedVerification);
      });
      return json;
    };
    let name = await nameAPI();
    if (json == undefined) {
      return;
    }

    embedVerification = new Discord.MessageEmbed()
      .setTitle('Name found!')
      .setDescription('This minecraft accound was found!')
      .setColor('GREEN')
      .setFooter(`Name: ${name.name}, ID: ${name.id}`);

    message.channel.send(embedVerification);
  }
}