class CommandBase {
  /**
   * The command data
   * @type { import("discord.js/typings/index.js").ApplicationCommandData }
   */
  command

  /**
   * What executes when the command is executed
   * @param { import("discord.js/typings/index.js").CommandInteraction } interaction The interaction
   */
  async execute(interaction) {}

  /**
   * Required permission to execute the command (optional)
   * @type { import("discord.js/typings/index.js").PermissionResolvable }
   */
  permission
}

module.exports = {
  CommandBase
}
