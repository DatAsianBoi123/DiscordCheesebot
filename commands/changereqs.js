module.exports = {
  name: 'changereqs',
  description: 'Changes requirements',
  disabled: false,
  category: 'Guild',
  async execute(message, args) {
    const Discord = require('discord.js');
    const index = require('../index');

    reqs = await index.getDataByType('Reqs', 'reqs');
    index.updateById(reqs._id.toString(), 'reqs', args[0]);
  }
}