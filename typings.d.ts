import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, Client, CommandInteraction, CommandInteractionOptionResolver, Guild, TextChannel, User } from 'discord.js';

interface ICallbackObject {
  channel: TextChannel
  client: Client
  guild: Guild
  args: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
  interaction: CommandInteraction
  user: User
}

export interface ICommand {
  data: SlashCommandBuilder
  skip?: boolean
  callback(obj: ICallbackObject): Promise<void>
}

export type SkillResolvable = 'FARMING' | 'MINING' | 'COMBAT' | 'FORAGING' | 'FISHING' | 'ENCHANTING' | 'ALCHEMY' | 'TAMING';
