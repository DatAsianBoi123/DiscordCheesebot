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
    console.log(client.commands);

    console.log(allCommands);
  }
}