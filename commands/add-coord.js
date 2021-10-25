const { CommandBase } = require("../api/command-base");

/**
 * @type { CommandBase }
 */
module.exports = {
  command: {
    name: 'add',
    description: 'Adds a SMP coordinate',
    options: [
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
    interaction.reply({ content: `Created a new coordinate ${interaction.options.getNumber('x')} ${interaction.options.getNumber('y')} ${interaction.options.getNumber('z')} in ${interaction.options.getString('dimension')}` });
  }
}
