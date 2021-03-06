module.exports = {
  name: 'resetreqs',
  description: 'Resets guild requirements',
  disabled: false,
  category: 'Guild',
  async execute(message, args) {
    const Discord = require('discord.js');
    const index = require('../index');

    req = await index.getDataByType('Reqs', 'reqs');
    index.updateById(req._id.toString(), 'reqs', {
      reqs: 'No reqs for now!'
    }).catch(() => {
      message.channel.send('Something went wrong while resetting requirements.');
    });
    message.channel.send('Successfully reset requirements!');
  }
}