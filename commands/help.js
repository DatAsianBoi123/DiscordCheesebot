module.exports = {
  name: 'help',
  description: 'Shows the help page',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    const fs = require('fs');
    const index = require('../index');

    const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));
    for (const files of commandFiles) {
      const command = require(`./commands/${files}`);
    
      client.commands.set(command.name, command);
    }

    const commandScript = client.commands.get();
    let helpText = '';
    for (command of commandScript) {
      helpText += `Name: ${command.name}, Description: ${command.description}`;
    }
    message.channel.send(helpText);
  }
}