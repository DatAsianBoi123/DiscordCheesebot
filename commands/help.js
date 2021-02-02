module.exports = {
  name: 'help',
  description: 'Shows the help page',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    const index = require('../index');

    const commandScript = client.commands.get();
    let helpText = '';
    for (command of commandScript) {
      helpText += `Name: ${command.name}, Description: ${command.description}`;
    }
    message.channel.send(helpText);
  }
}