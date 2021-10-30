const {
  MessageEmbed
} = require('discord.js/src/index.js');
const {
  CommandBase
} = require('../api/command-base');
const crypto = require('crypto');

/**
 * @type { CommandBase }
 */
module.exports = {
  command: {
    name: 'createlocation',
    description: 'Adds a SMP coordinate',
    options: [{
        name: 'name',
        description: 'The name of the location',
        type: 'STRING',
        required: true
      },
      {
        name: 'x',
        description: 'The x coordinate',
        type: 'NUMBER',
        required: true
      },
      {
        name: 'y',
        description: 'The y coordinate',
        type: 'NUMBER',
        required: true
      },
      {
        name: 'z',
        description: 'The z coordinate',
        type: 'NUMBER',
        required: true
      },
      {
        name: 'dimension',
        description: 'The coordinate dimension',
        type: 'STRING',
        choices: [{
            name: 'Overworld',
            value: 'overworld'
          },
          {
            name: 'Nether',
            value: 'overworld'
          },
          {
            name: 'End',
            value: 'overworld'
          }
        ],
        required: true
      }
    ]
  },
  async execute(interaction) {
    // if (interaction.options.getString('dimension') > 2) {
    //   interaction.reply({
    //     content: `Invalid dimension`,
    //     ephemeral: true
    //   });

    //   return;
    // }

    const embed = new MessageEmbed()
      .setTitle('Successfully Created a New Location')
      .setFields({
        name: 'Name',
        value: interaction.options.getString('name'),
        inline: false
      }, {
        name: 'Coordinates',
        value: `${interaction.options.getNumber('x')} ${interaction.options.getNumber('y')} ${interaction.options.getNumber('z')}`,
        inline: false
      }, {
        name: 'Dimension',
        value: interaction.options.getString('dimension').toUpperCase(),
        inline: false
      })
      .setColor('GREEN')
      .setFooter(crypto.randomBytes(16).toString('hex'))
      .setTimestamp(interaction.createdTimestamp);

    interaction.reply({
      embeds: [embed]
    });
  }
}

/**
 * @param { Number } number The dimension digit
 * @returns { String } The dimension in string form
 */
function parseDimension(number) {
  switch (number) {
    case 0:
      return 'overworld'
    
    case 1:
      return 'nether'
    
    case 2:
      return 'end'

    default:
      return null
  }
}
