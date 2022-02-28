import { Client, Collection, CommandInteraction, GuildMember, InteractionReplyOptions } from 'discord.js';
import { Logger } from './logger';
import { IClientOptions, ICommand, IDeployCommandsOptions } from '../typings';
import mongoose from 'mongoose';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import guildCommandModel from '../models/guild-command-model';

export class BurgerClient {
  public static readonly logger = new Logger('Burger Client');

  private _client: Client;
  private _options: IClientOptions;
  private _commands = new Collection<string, ICommand>();

  constructor(client: Client, options: IClientOptions) {
    if (!client.isReady()) {
      BurgerClient.logger.log('Client has not logged in yet.', 'CRITICAL');
      process.exit(1);
    }

    options.logInfo ??= true;

    client.guilds.fetch().then(() => {
      if (!client.guilds.cache.has(options.guildId)) {
        BurgerClient.logger.log('The bot is not a part of that guild.', 'CRITICAL');
        process.exit(1);
      }

      if (options.mongoURI) {
        mongoose.connect(options.mongoURI).then(() => {
          if (options.logInfo) BurgerClient.logger.log('Connected to MongoDB.');
          if (options.logInfo) BurgerClient.logger.log(`Ready! Logged in as ${client.user.tag}`);
        }).catch(() => {
          BurgerClient.logger.log('An error occurred when connecting to MongoDB.', 'ERROR');
          process.exit(1);
        });
      }
    });

    this._client = client;
    this._options = options;
  }

  public registerCommand(command: ICommand, displayName: string) {
    if (!BurgerClient.isValid(command)) {
      if (this._options.logInfo) BurgerClient.logger.log(`The command ${displayName} is not registered correctly.`, 'WARNING');
      return;
    }

    if (command.skip) {
      if (this._options.logInfo) BurgerClient.logger.log(`Skipped command ${displayName}.`);
      return;
    }

    if (this._options.logInfo) BurgerClient.logger.log(`Registered command ${displayName}.`);
    this._commands.set(command.data.name, command);
  }

  public async resolveCommand(interaction: CommandInteraction) {
    const command = this._commands.get(interaction.commandName);

    if (!command) return BurgerClient.logger.log(`The command ${interaction.commandName} was not registered.`, 'WARNING');

    const disallowedTextChannels = command.disallowedTextChannels ?? [];

    if (disallowedTextChannels.includes(interaction.channel.type)) return interaction.reply('This command is not enabled here');

    await command.listeners.onExecute({ interaction: interaction, channel: interaction.channel, args: interaction.options, client: interaction.client, guild: interaction.guild, user: interaction.user, member: interaction.member as GuildMember }).catch(error => {
      BurgerClient.logger.log(`An error occurred when executing command ${command.data.name}: ${error.message}`, 'ERROR');
      if (command.listeners.onError) {
        command.listeners.onError({ interaction, error });
      } else {
        const reply: InteractionReplyOptions = {
          content: 'There was an error executing this command',
        };

        interaction.replied || interaction.deferred ? interaction.editReply(reply) : interaction.reply(reply);
      }
    });
  }

  public getClient() {
    return this._client;
  }

  public getCommands() {
    return this._commands.clone();
  }

  public static async deployCommands(options: IDeployCommandsOptions, commands: ICommand[]) {
    options.logInfo ??= true;

    if (options.mongoURI) {
      if (!mongoose.connection) {
        await mongoose.connect(options.mongoURI).then(() => {
          if (options.logInfo) this.logger.log('Connected to MongoDB.');
        }).catch(() => {
          this.logger.log('An error occurred when connecting to MongoDB.', 'ERROR');
          return;
        });
      }
    }

    const rest = new REST({ version: '9' }).setToken(options.token);

    const deployGuildCommands = async (guildCommands: unknown[]) => {
      await rest.put(Routes.applicationGuildCommands(options.userId, options.guildId), { body: guildCommands })
        .catch(err => {
          BurgerClient.logger.log(`An error occurred when deploying guild commands: ${err.message}`, 'ERROR');
          return;
        });
      if (options.logInfo) BurgerClient.logger.log(`Successfully registered ${guildCommands.length} guild commands.`);
    };

    const deployGlobalCommands = async (globalCommands: unknown[]) => {
      await rest.put(Routes.applicationCommands(options.userId), { body: globalCommands })
        .catch(() => {
          BurgerClient.logger.log('An error occurred when deploying global commands.', 'ERROR');
          return;
        });
      if (options.logInfo) BurgerClient.logger.log(`Successfully registered ${globalCommands.length} global commands.`);
    };

    const guildCommands = [];
    const globalCommands = [];

    for (const command of commands) {
      if (options.logInfo) BurgerClient.logger.log(`Loaded command ${command.data.name}.`);
      command.type === 'GUILD' ? guildCommands.push(command.data.toJSON()) : globalCommands.push(command.data.toJSON());
    }

    await deployGuildCommands(guildCommands);
    await deployGlobalCommands(globalCommands);

    if (mongoose.connection) {
      const guildCommandModels = [];

      for (const command of guildCommands) {
        const { id, name, description, guild_id } = command;
        guildCommandModels.push({ id, name, description, guild_id });
      }

      await guildCommandModel.model.deleteMany();
      guildCommandModel.model.create(guildCommandModels);
    }
  }

  public static isValid(command: ICommand) {
    return !!command?.data && !!command?.type && !!command?.listeners?.onExecute;
  }

  public static async login(client: Client, token: string, options: IClientOptions) {
    await client.login(token);
    return new this(client, options);
  }
}
