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
    interaction.channel.send(interaction.options.getString('message')).then(() => {
      interaction.reply({ content: 'I said it :)', ephemeral: true });
    });
  },
  permission = 'MANAGE_MESSAGES'
}