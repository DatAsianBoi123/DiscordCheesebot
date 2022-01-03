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

interface IErrorObject {
  error: Error
  interaction: CommandInteraction
}

interface IListeners {
  onExecute(obj: ICallbackObject): Promise<void>
  onError?(obj: IErrorObject): Promise<void>
}

export interface ICommand {
  data: SlashCommandBuilder
  skip?: boolean
  disallowedTextChannels?: ('DM' | 'GUILD_TEXT' | 'GUILD_NEWS' | ThreadChannelTypes)[]
  type: 'GUILD' | 'GLOBAL'
  listeners: IListeners
}

export type CommandOptions = {
  name: string
  client: Client
  guildId?: Snowflake
}

export type SkillResolvable = 'FARMING' | 'MINING' | 'COMBAT' | 'FORAGING' | 'FISHING' | 'ENCHANTING' | 'ALCHEMY' | 'TAMING';
