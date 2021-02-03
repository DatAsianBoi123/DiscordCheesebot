module.exports = {
  name: 'help',
  description: 'Shows the help page',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const Discord = require('discord.js');
    const fs = require('fs');
    const index = require('../index');

    let allCommands = {}
    async function getFiles() {
      const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
      for (const files of commandFiles) {
        const command = require(`../commands/${files}`);

        allCommands[command.name] = command;
      }
    }
    await getFiles();

    let helpEmbed = new Discord.MessageEmbed()
      .setTitle('Help Screen')
      .setDescription(`Prefix: ${index.prefix}\n<> = Required, [] = Optional`)
      .setColor('ORANGE');
    for (const command in allCommands) {
      if (allCommands[command].disabled == true) {
        helpEmbed.addField({ name: `~~${allCommands[command].name}~~`, value: 'This command is currently disabled!', inline: true });
        continue;
      }
      helpEmbed.addField({ name: allCommands[command].name, value: allCommands[command].description, inline: true });
    }
    message.channel.send(helpEmbed);
  }
}