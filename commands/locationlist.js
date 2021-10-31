const MessageEmbed = require('discord.js/src/structures/MessageEmbed.js');

/**
 * @type { import('wokcommands').ICommand }
 */
module.exports = {
  category: 'SMP',
  description: 'Shows all created locations',
  slash: true,
  testOnly: true,
  options: [{
      name: 'page',
      description: 'The page number to view',
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
      type: 'INTEGER',
      choices: [{
          name: 'Overworld',
          value: 0
        },
        {
          name: 'Nether',
          value: 1
        },
        {
          name: 'End',
          value: 2
        }
      ]
    }
  ],
  callback: ({
    interaction
  }) => {
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
