module.exports = {
  name: 'help',
  description: 'Shows the help page',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const Discord = require('discord.js');
    const fs = require('fs');
    const index = require('../index');

    if (isNaN(parseInt(args[0]))) return message.reply(`Incorrect command format! (${index.prefix}help [page number])`);
    if (parseInt(args[0]) + 1 > index.categories.length) return message.reply(`This page number doesn't exist!`);

    const pageNumber;
    if (args[0]) pageNumber = parseInt(args[0]) + 1;
    else pageNumber = 0;

    let allCommands = {}
    async function getFiles() {
      const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
      for (const files of commandFiles) {
        const command = require(`../commands/${files}`);

        allCommands[command.name] = command;
      }
    }
    await getFiles();

    let helpEmbed = {
      title: 'Help Page 1',
      description: `Prefix: ${index.prefix}\n\n<> = Required, [] = Optional`,
      color: 15105570,
      fields: []
    }

    for (const command in allCommands) {
      if (allCommands[command].category != index.categories[pageNumber]) continue;

      if (allCommands[command].disabled == true) {
        helpEmbed.fields.push({
          name: `~~${allCommands[command].name}~~`,
          value: 'This command is currently disabled',
          inline: true
        });
        continue;
      }
      helpEmbed.fields.push({
        name: allCommands[command].name,
        value: allCommands[command].description,
        inline: true
      });
    }
    message.channel.send({
      embed: helpEmbed
    });
  }
}