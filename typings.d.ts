import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, Client, CommandInteraction, CommandInteractionOptionResolver, Guild, Snowflake, TextBasedChannels, ThreadChannelTypes, User } from 'discord.js';

interface ICallbackObject {
  channel: TextBasedChannels
  client: Client
  guild: Guild
  args: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
  interaction: CommandInteraction
  user: User
}

export interface ICommand {
  data: SlashCommandBuilder
  skip?: boolean
  disallowedTextChannels?: ('DM' | 'GUILD_TEXT' | 'GUILD_NEWS' | ThreadChannelTypes)[]
  adminCommand: boolean
  type: 'GUILD' | 'GLOBAL'
  callback(obj: ICallbackObject): Promise<void>
}

export type CommandOptions = {
  name: string
  client: Client
  guildId?: Snowflake
}

export type SkillResolvable = 'FARMING' | 'MINING' | 'COMBAT' | 'FORAGING' | 'FISHING' | 'ENCHANTING' | 'ALCHEMY' | 'TAMING';
