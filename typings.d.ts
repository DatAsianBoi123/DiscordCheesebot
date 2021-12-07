import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, Client, CommandInteraction, CommandInteractionOptionResolver, Guild, TextBasedChannels, User } from 'discord.js';

interface ICallbackObject {
  channel: TextBasedChannels
  client: Client
  guild: Guild
  args: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
  interaction: CommandInteraction
  user: User
}

export type ICommand = {
  data: SlashCommandBuilder
  skip?: boolean
  disallowedTextChannels?: TextBasedChannels[]
  type: 'GUILD' | 'GLOBAL'
  callback(obj: ICallbackObject): Promise<void>
}

export type SkillResolvable = 'FARMING' | 'MINING' | 'COMBAT' | 'FORAGING' | 'FISHING' | 'ENCHANTING' | 'ALCHEMY' | 'TAMING';
