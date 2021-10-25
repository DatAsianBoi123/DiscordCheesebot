export class CommandBase {
  /**
   * The command data
   * @type { import("discord.js/typings/index.js").ApplicationCommandData }
   */
  command

  /**
   * 
   * @param {import("discord.js/typings/index.js").CommandInteraction} interaction The interaction
   */
  async execute(interaction) { }
}