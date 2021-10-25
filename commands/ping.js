const { CommandBase } = require("../api/command-base");

/**
 * @type { CommandBase }
 */
module.exports = {
  command: {
    name: 'say',
    description: 'Says a thing',
    options: [
      {
        name: 'message',
        description: 'The message to say',
        type: 'STRING',
        required: true
      }
    ]
  },
  async execute(interaction) {
    interaction.reply({ content: 'I said it :)' });
  }
}