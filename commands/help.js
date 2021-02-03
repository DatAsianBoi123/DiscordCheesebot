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

    client.commands = new Discord.Collection();

    async function getFiles() {
      const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
      for (const files of commandFiles) {
        const command = require(`../commands/${files}`);

        client.commands.set(command.name, command);
      }
    }
    await getFiles();
    console.log(client.commands);
  }
}