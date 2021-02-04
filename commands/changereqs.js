module.exports = {
  name: 'changereqs',
  description: 'Changes requirements',
  disabled: false,
  category: 'Guild',
  async execute(message, args) {
    const Discord = require('discord.js');
    const index = require('../index');

    req = await index.getDataByType('Reqs', 'reqs');
    index.updateById(req._id.toString(), 'reqs', {
      reqs: args[0]
    });
  }
}