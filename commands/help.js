module.exports = {
  name: 'help',
  description: 'Shows the help page',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const Discord = require('discord.js');
    const fs = require('fs');
    const index = require('../index');

    if (!args[0]) args[0] = '0';
    if (isNaN(parseInt(args[0]))) return message.reply(`Incorrect command format! (${index.prefix}help [page number])`);

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
    console.log(parseInt(args[0]));
    console.log(index.categories[parseInt(args[0])]);

    for (const command in allCommands) {
      if (allCommands[command].category != index.categories[parseInt(args[0])]) return;

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