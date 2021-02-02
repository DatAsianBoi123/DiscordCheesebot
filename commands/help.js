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
    const commandFiles = fs.readdirSync('..').filter(file => file.endsWith('.js'));
    commandFiles.forEach((err, file) => {
      if (err) return console.log(`An error occured \n${err}`);
      allCommands[file.name] = file;
      console.log(file);
    });

    console.log(allCommands);
  }
}