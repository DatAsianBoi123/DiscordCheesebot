module.exports = {
  name: 'info',
  description: 'Shows info about the server',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const Discord = require('discord.js');
    const index = require('../index');

    let embedInfo = new Discord.MessageEmbed()
      .setTitle('Server Info:')
      .setDescription(`Server name: ${message.guild.name} \nTotal members: ${message.guild.memberCount}`)
      .setColor('ORANGE');
    message.channel.send(embedInfo);
  }
}