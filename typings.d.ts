import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, Client, CommandInteraction, CommandInteractionOptionResolver, Guild, GuildMember, TextBasedChannel, ThreadChannelTypes, User } from 'discord.js';

interface ICallbackObject {
  channel: TextBasedChannel;
  client: Client;
  guild?: Guild;
  args: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>;
  interaction: CommandInteraction;
  user: User;
  member?: GuildMember;
}

interface IErrorObject {
  error: Error;
  interaction: CommandInteraction;
}

interface IListeners {
  onExecute(obj: ICallbackObject): Promise<unknown>;
  onError?(obj: IErrorObject): Promise<void>;
}

interface ISkyblockProfile {
  profile_id: string;
  members: object;
  community_upgrades: ICommunityUpgrades;
  cute_name: string;
  game_mode?: SkyblockGameModes;
  banking?: IBankingInfo;
}

interface IBankingInfo {
  balance: number;
  transactions: IBankingTransactions[];
}

interface IBankingTransactions {
  amount: number;
  timestamp: number;
  action: BankTransactionActions;
  initiator_name: string;
}

interface ICommunityUpgrades {
  currently_upgrading?: string | null;
  upgrade_states: Record<string, string | number | boolean>[];
}

interface IHypixelPlayer {
  [key: string]: string | number | boolean | object;

  _id: string;
  uuid: string;
  displayname: string;
  firstLogin: number;
  lastLogin: number;
  playername: string;
  karma: string;
  stats: Record<string, Record<string, string | number | boolean | object>>;
  networkExp: number;
  achievements: Record<string, number>;
  socialMedia: IHypixelSocialMedia;
}

interface IHypixelSocialMedia {
  [key: string]: string | boolean | object;

  links: Record<string, string>;
  prompt?: boolean;
}

type HypixelDefaultFetchModel = {
  success: boolean;
  cause?: string;
};

type SkyblockGameModes = 'bingo' | 'ironman' | 'island';

type BankTransactionActions = 'DEPOSIT' | 'WITHDRAW';

export interface IClientOptions {
  guildId: string;
  adminRoleId: string;
  mongoURI?: string;
  logInfo?: boolean;
}

export interface IDeployCommandsOptions {
  token: string;
  guildId: string;
  userId: string;
  mongoURI?: string;
  logInfo?: boolean;
}

export interface ICommand {
  data: SlashCommandBuilder;
  skip?: boolean;
  disallowedTextChannels?: ('DM' | 'GUILD_TEXT' | 'GUILD_NEWS' | ThreadChannelTypes | 'GUILD_VOICE')[];
  adminCommand?: boolean;
  type: 'GUILD' | 'GLOBAL';
  listeners: IListeners;
}

export type LoggerLevels = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type MinecraftUserFetchModel = {
  name: string;
  id: string;
};

export type SkyblockProfilesFetchModel = HypixelDefaultFetchModel & {
  profiles: ISkyblockProfile[] | null;
};

export type HypixelPlayerFetchModel = HypixelDefaultFetchModel & {
  player: IHypixelPlayer;
};

export type SkillResolvable = 'FARMING' | 'MINING' | 'COMBAT' | 'FORAGING' | 'FISHING' | 'ENCHANTING' | 'ALCHEMY' | 'TAMING';
