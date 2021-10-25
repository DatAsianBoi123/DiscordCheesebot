const { CommandBase } = require("../api/command-base");

/**
 * @type { CommandBase }
 */
module.exports = {
  command: {
    name: 'createlocation',
    description: 'Adds a SMP coordinate',
    options: [
      {
        name: 'Name',
        description: 'The name of the location',
        type: 'STRING',
        required: true
      },
      {
        name: 'X',
        description: 'The x coordinate',
        type: 'NUMBER',
        required: true
      },
      {
        name: 'Y',
        description: 'The y coordinate',
        type: 'NUMBER',
        required: true
      },
      {
        name: 'Z',
        description: 'The z coordinate',
        type: 'NUMBER',
        required: true
      },
      {
        name: 'Dimension',
        description: 'The coordinate dimension',
        type: 'STRING',
        required: true
      }
    ]
  },
  async execute(interaction) {
    interaction.reply({ content: `Created a new location called ${interaction.options.getString('Name')} at ${interaction.options.getNumber('X')} ${interaction.options.getNumber('Y')} ${interaction.options.getNumber('Z')} in ${interaction.options.getString('Dimension')}` });
  }
}
