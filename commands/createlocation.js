const {
  MessageEmbed
} = require('discord.js/src/index.js');
const crypto = require('crypto');

/**
 * @type { import('wokcommands').ICommand }
 */
module.exports = {
  category: 'SMP',
  description: 'Creates a new SMP Location',
  slash: true,
  testOnly: true,
  options: [{
      name: 'name',
      description: 'The location name',
      type: 'STRING',
      required: true
    },
    {
      name: 'x',
      description: 'The x coordinate of the location',
      type: 'INTEGER',
      required: true
    },
    {
      name: 'y',
      description: 'The y coordinate of the location',
      type: 'INTEGER',
      required: true
    },
    {
      name: 'z',
      description: 'The z coordinate of the location',
      type: 'INTEGER',
      required: true
    },
    {
      name: 'dimension',
      description: 'The dimension the location is in',
      type: 'INTEGER',
      required: true,
      choices: [
        {
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
    interaction,
    args
  }) => {
    const [name, x, y, z, dimension] = args;

    const embed = new MessageEmbed()
      .setTitle('Successfully Created a New Location')
      .setFields({
        name: 'Name',
        value: name,
        inline: false
      }, {
        name: 'Coordinates',
        value: `${parseInt(x)} ${parseInt(y)} ${parseInt(z)}`,
        inline: false
      }, {
        name: 'Dimension',
        value: parseDimension(parseInt(dimension)),
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
      return 'Overworld'

    case 1:
      return 'Vether'

    case 2:
      return 'End'

    default:
      return null
  }
}
