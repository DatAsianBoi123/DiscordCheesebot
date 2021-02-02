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

    let allCommands = {}
    const commandFiles = fs.readdirSync('..').filter(file => file.endsWith('.js'));
    for (const files of commandFiles) {
      const command = require(`../commands/${files}`);

      allCommands[command.name] = command;
    }

    console.log(allCommands.toString());
  }
}