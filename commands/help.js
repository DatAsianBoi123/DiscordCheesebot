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
    fs.readdirSync('./', (err, files) => {
      if (err) return console.log(`An error occured ${err}`);

      allCommands = files;
      console.log(files);
    });

    console.log(allCommands);
  }
}