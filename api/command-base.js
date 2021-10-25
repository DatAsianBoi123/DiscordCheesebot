import { CommandInteraction } from "discord.js/typings/index.js";

export class CommandBase {
  /**
   * The command data
   * @type { import("discord.js/typings/index.js").ApplicationCommandData }
   */
  command

  /**
   * 
   * @param {CommandInteraction} interaction The interaction
   */
  async execute(interaction) { }
}