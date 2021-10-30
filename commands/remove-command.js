const {
  Permissions,
} = require('discord.js');
const {
  CommandBase
} = require('../api/command-base');
const {
  getCommands
} = require('../bot');

/**
 * @type { CommandBase }
 */
module.exports = {
  command: {
    name: 'removecommand',
    description: 'Removes a command',
    options: [{
      name: 'name',
      description: 'The name of the command',
      type: 'STRING',
      required: true
    }]
  },
  permission: Permissions.FLAGS.ADMINISTRATOR,
  async execute(interaction) {
    const commands = getCommands();

    commands.fetch().then(commandData => {
      for (const command of commandData) {
        if (command[1].name == interaction.options.getString('name')) {
          commands.delete(command[1]).then(() => {
            interaction.reply({
              content: 'Deleted Command',
              ephemeral: true
            });
          }).catch(() => {
            interaction.reply({
              content: 'An error occurred when deleting the command',
              ephemeral: true
            });
          });
        }
      }
    });
  }
}
