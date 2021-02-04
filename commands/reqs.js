module.exports = {
  name: 'reqs',
  description: 'Shows the requirements of the guild',
  disabled: false,
  category: 'Guild',
  async execute(message, args) {
    const Discord = require('discord.js');
    const index = require('../index');

    reqs = await index.getDataByType('Reqs', 'reqs');
    message.channel.send(reqs.reqs);
  }
}