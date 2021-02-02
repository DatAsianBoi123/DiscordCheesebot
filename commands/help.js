module.exports = {
  name: 'help',
  description: 'Shows the help page',
  disabled: false,
  category: 'General',
  async execute(message, args, client) {
    const Discord = require('discord.js');
    const index = require('../index');

    const commandScript = client.commands.get();
    let helpText = '';
    for (command in commandScript) {
      helpText += `Name: ${command.name}, Description: ${command.description}`;
    }
    message.channel.send(helpText);
  }
}