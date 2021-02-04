module.exports = {
  name: 'changereqs',
  description: 'Changes requirements',
  disabled: false,
  category: 'Guild',
  async execute(message, args) {
    const Discord = require('discord.js');
    const index = require('../index');

    req = await index.getDataByType('Reqs', 'reqs');
    console.log(`${args[0]}, ${req._id.toString()}`);
    index.updateById(req._id, 'reqs', args[0]);
    message.channel.send(req.reqs);
  }
}