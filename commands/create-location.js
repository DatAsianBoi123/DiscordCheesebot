const { CommandBase } = require("../api/command-base");

/**
 * @type { CommandBase }
 */
module.exports = {
  command: {
    name: 'createlocation',
    description: 'Adds a SMP coordinate',
    options: [
      // {
      //   name: 'Location Name',
      //   description: 'The name of the location',
      //   type: 'STRING',
      //   required: true
      // },
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
        required: true
      }
    ]
  },
  async execute(interaction) {
    // interaction.reply({ content: `Created a new location called ${interaction.options.getString('Location Name')} at ${interaction.options.getNumber('X')} ${interaction.options.getNumber('Y')} ${interaction.options.getNumber('Z')} in ${interaction.options.getString('Dimension')}` });
  }
}
