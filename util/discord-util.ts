import { ApplicationCommand } from 'discord.js';
import { CommandOptions } from '../typings';

export class DiscordUtil {
  static async getCommandFromName(options: CommandOptions) {
    let command: ApplicationCommand;
    const allCommands = options.guildId ? await options.client.guilds.cache.get(options.guildId).commands.fetch() : await options.client.application.commands.fetch();

    allCommands.forEach(cmd => command = cmd.name === options.name ? cmd : null);

    return command;
  }
}
