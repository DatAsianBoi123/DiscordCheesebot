const { ApplicationCommand, CommandInteraction } = require('discord.js');

class ApplicationCommandBase {
  /**
   * The application command
   * @type { ApplicationCommand }
   */
  applicationCommand

  /**
   * The command permissions (optional)
   * @type { import('discord.js/typings/index.js').PermissionResolvable }
   */
  permissions

  /**
   * What executes when the command is executed
   * @param { CommandInteraction } interaction The command interaction
   */
  async execute(interaction) { }
}

module.exports = {
  ApplicationCommandBase
}
