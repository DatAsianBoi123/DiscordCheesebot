module.exports = {
  name: 'changereqs',
  description: 'Changes requirements',
  disabled: false,
  category: 'Guild',
  async execute(message, args) {
    const Discord = require('discord.js');
    const index = require('../index');

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
    if (!args[0]) return message.reply(`Incorrect command format! (${index.prefix}changereqs <new requirements>)`);

    newReqs = args.join(' ');
    req = await index.getDataByType('Reqs', 'reqs');
    index.updateById(req._id.toString(), 'reqs', {
      reqs: args[0]
    }).catch(() => {
      message.channel.send('Something went wrong while updating requirements.');
    });
    message.channel.send(`Successfully set requirements to \`\`${newReqs}\`\``);
  }
}