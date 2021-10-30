const MessageEmbed = require('discord.js/src/structures/MessageEmbed.js');
const {
  CommandBase
} = require('../api/command-base');

/**
 * @type { CommandBase }
 */
module.exports = {
  command: {
    name: 'locationlist',
    description: 'Shows all created locations',
    options: [{
        name: 'page',
        description: 'The page page number',
        type: 'INTEGER',
        required: false
      },
      {
        name: 'name',
        description: 'The name to filter locations by',
        type: 'STRING',
        required: false
      },
      {
        name: 'dimension',
        description: 'The dimension to filter locations by',
        type: 'STRING',
        required: false
      }
    ]
  },
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setTitle('All Locations')
      .setFields([{
        name: 'Example Location',
        value: '0 0 0 in The Overworld\nCreated by DatAsianBoi123 at 10/25/2021',
        inline: true
      }])
      .setColor('BLUE')
      .setFooter('Page 1/1')
      .setTimestamp(interaction.createdTimestamp);

    interaction.reply({
      embeds: [embed]
    });
  }
}
