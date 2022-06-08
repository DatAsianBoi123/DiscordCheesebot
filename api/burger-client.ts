import { Awaitable, Client, ClientEvents, ClientUser, Collection, CommandInteraction, GuildMember, InteractionReplyOptions } from 'discord.js';
import { Logger } from './logger';
import { IClientOptions, ICommand, IDeployCommandsOptions } from '../typings';
import mongoose from 'mongoose';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import guildCommandModel from '../models/guild-command-model';
import fs from 'fs';

export class BurgerClient {
  public static readonly logger = new Logger('Burger Client');

  private _client: Client;
  private _options: IClientOptions;
  private _commands = new Collection<string, ICommand>();

  constructor(intents: number[], options: IClientOptions) {
    this._client = new Client({ intents });

    options.logInfo ??= true;

    if (options.mongoURI) {
      mongoose.connect(options.mongoURI).then(() => {
        if (options.logInfo) BurgerClient.logger.log('Connected to MongoDB.');
        if (options.logInfo) BurgerClient.logger.log(`Ready! Logged in as ${this._client.user.tag}`);
      }).catch(() => {
        BurgerClient.logger.log('An error occurred when connecting to MongoDB.', 'ERROR');
        process.exit(1);
      });
    }

    this._options = options;
  }

  public async login(token: string) {
    await this._client.login(token);

    this._client.guilds.fetch().then(() => {
      if (!this._client.guilds.cache.has(this._options.guildId)) {
        BurgerClient.logger.log('The bot is not a part of that guild.', 'CRITICAL');
        process.exit(1);
      }
    });

    return this._client;
  }

  public onReady(cb: (client: Client<true>) => Awaitable<void>) {
    this._client.on('ready', cb);
  }

  public on<T extends keyof ClientEvents>(event: T, listener: (...arg: ClientEvents[T]) => Awaitable<void>) {
    return this._client.on(event, listener);
  }

  public registerAllCommands(dir: string): ICommand[] | null {
    const commands: ICommand[] = [];
    let commandFiles: string[];

    try {
      commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.ts'));
    } catch (e) {
      BurgerClient.logger.log('Invalid Directory', 'ERROR');
      return null;
    }

    for (const file of commandFiles) {
      let command: ICommand;

      try {
        command = require.main.require(`${dir}/${file}`);
      } catch (err) {
        BurgerClient.logger.log(`An error occurred when registering the command in file ${file}: ${err.message}`, 'ERROR');
        continue;
      }

      this.registerCommand(command, file);
      commands.push(command);
    }

    return commands;
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

  /**
   * @deprecated
   */
  public async updatePermissions() {
    if (this._options.logInfo) BurgerClient.logger.log('Updating guild command permissions...');
    const commands = await this._client.guilds.cache.get(this._options.guildId).commands.fetch();
    const adminCommands = this._commands.filter(command => command.adminCommand);

    // TODO: Bulk Update Permissions
    for (const [name] of adminCommands) {
      const found = commands.find(cmd => cmd.name === name);
      if (!found) {
        BurgerClient.logger.log(`Command not found: ${name}.`, 'WARNING');
        continue;
      }
      await found.setDefaultPermission(false);
      await found.permissions.set({ permissions: [
        {
          id: this._options.adminRoleId,
          type: 'ROLE',
          permission: true,
        },
      ] });

      if (this._options.logInfo) BurgerClient.logger.log(`Updated permissions for command ${name}.`);
    }

    if (this._options.logInfo) BurgerClient.logger.log('Done!');
  }

  public async resolveCommand(interaction: CommandInteraction) {
    const command = this._commands.get(interaction.commandName);

    if (!command) {
      BurgerClient.logger.log(`The command ${interaction.commandName} was not registered.`, 'WARNING');
      interaction.reply('This command is not registered, please report this!');
      return;
    }

    const disallowedTextChannels = command.disallowedTextChannels ?? [];
    const member = interaction.member as GuildMember;

    if (disallowedTextChannels.includes(interaction.channel.type)) return interaction.reply('This command is not enabled here');
    if (interaction.inGuild() && command.adminCommand && !member.roles.cache.has(this._options.adminRoleId)) {
      await interaction.reply('You do not have permission to use this command');
      return;
    }

    await command.listeners.onExecute({ interaction: interaction, channel: interaction.channel, args: interaction.options, client: interaction.client, guild: interaction.guild, user: interaction.user, member }).catch(error => {
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

  public static allCommandsInDir(dir: string): ICommand[] | null {
    const commands: ICommand[] = [];
    let commandFiles: string[];

    try {
      commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.ts'));
    } catch (e) {
      BurgerClient.logger.log('Invalid Directory', 'ERROR');
      return null;
    }

    for (const file of commandFiles) {
      let command: ICommand;

      try {
        command = require.main.require(`${dir}/${file}`);
      } catch (err) {
        BurgerClient.logger.log(`An error occurred when registering the command in file ${file}: ${err.message}`, 'ERROR');
        continue;
      }

      if (!BurgerClient.isValid(command)) {
        BurgerClient.logger.log(`The command ${file} is not registered correctly.`, 'WARNING');
        continue;
      }

      if (command.skip) {
        BurgerClient.logger.log(`Skipped command ${command.data.name}.`);
        continue;
      }

      commands.push(command);
    }

    return commands;
  }

  public static async deployCommands(options: IDeployCommandsOptions, commands: ICommand[]) {
    options.logInfo ??= true;

    if (options.mongoURI) {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(options.mongoURI).then(() => {
          if (options.logInfo) this.logger.log('Connected to MongoDB.');
        }).catch(() => {
          this.logger.log('An error occurred when connecting to MongoDB.', 'ERROR');
          return;
        });
      }
    }

    const rest = new REST({ version: '10' }).setToken(options.token);

    const deployGuildCommands = async (guildCommands: unknown[]) => {
      await rest.put(Routes.applicationGuildCommands(options.userId, options.guildId), { body: guildCommands })
        .then(allGuildCommands => {
          deployedGuildCommands = allGuildCommands as unknown[];
        })
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

    let deployedGuildCommands = [];

    for (const command of commands) {
      if (options.logInfo) BurgerClient.logger.log(`Loaded command ${command.data.name}.`);
      command.type === 'GUILD' ? guildCommands.push(command.data.toJSON()) : globalCommands.push(command.data.toJSON());
    }

    await deployGuildCommands(guildCommands);
    await deployGlobalCommands(globalCommands);

    if (mongoose.connection.readyState === 1) {
      const guildCommandModels = [];

      for (const command of deployedGuildCommands) {
        const { id, name, description, guild_id } = command;
        guildCommandModels.push({ id, name, description, guild_id });
      }

      await guildCommandModel.model.deleteMany({});
      await guildCommandModel.model.create(guildCommandModels);
      if (options.logInfo) this.logger.log('Populated guild commands.');
    }
  }

  public static isValid(command: ICommand) {
    return !!command?.data && !!command?.type && !!command?.listeners?.onExecute;
  }

  public get user(): ClientUser {
    return this._client.user;
  }
}
