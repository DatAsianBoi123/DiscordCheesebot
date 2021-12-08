import fs from 'fs';
import { Client, Collection, GuildApplicationCommandPermissionData, Intents, InteractionReplyOptions } from 'discord.js';
import { ADMIN_ROLE_ID, GUILD_ID, TOKEN } from './config';
import { ICommand } from './typings';
import { DiscordUtil } from './util/discord-util';

const client = new Client({ intents: Intents.FLAGS.GUILDS });

//* (MongoDB Stuff).then(() =>
start();

async function start() {
  const commands = new Collection<string, ICommand>();
  const fullPermissions: GuildApplicationCommandPermissionData[] = [];
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    let command: ICommand = null;

    try {
      command = require(`./commands/${file}`);

      if (!command || !command.data || !command.callback) {
        console.log(`Command in file ${file} is not registered correctly, skipping`);

        continue;
      }
    } catch (err) {
      console.log(`An error occured when registering command ${command.data.name} in file ${file}: ${err.message}`);

      continue;
    }

    if (command.skip) {
      console.log(`Skipped command ${command.data.name}`);

      continue;
    }

    // TODO: Update global command permissions as well
    const applicationCommand = command.type === 'GLOBAL' ? await DiscordUtil.getCommandFromName({ name: command.data.name, client: client }) : await DiscordUtil.getCommandFromName({ name: command.data.name, client: client, guildId: GUILD_ID });

    if (!applicationCommand) {
      console.log(`Skipped permissions for command ${command.data.name}: Command not found`);
    } else {
      command.adminCommand ? applicationCommand.defaultPermission = false : applicationCommand.defaultPermission = true;

      fullPermissions.push({
        id: applicationCommand.id,
        permissions: [
          {
            id: ADMIN_ROLE_ID,
            permission: true,
            type: 'ROLE',
          },
        ],
      });
    }

    console.log(`Registered command ${command.data.name} in file ${file}`);

    commands.set(command.data.name, command);
  }

  await client.guilds.cache.get(GUILD_ID).commands.permissions.set({ fullPermissions });

  client.once('ready', async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    client.user.setActivity({ name: 'everything', type: 'WATCHING' });
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    const disallowedTextChannels = command.disallowedTextChannels ?? [];

    if (disallowedTextChannels.includes(interaction.channel.type)) return interaction.reply('This command is not enabled here');

    try {
      await command.callback({ interaction: interaction, channel: interaction.channel, args: interaction.options, client: interaction.client, guild: interaction.guild, user: interaction.user });
    } catch (error) {
      console.error(error);

      const reply: InteractionReplyOptions = {
        content: 'There was an error executing this command',
      };

      interaction.replied || interaction.deferred ? interaction.editReply(reply) : interaction.reply(reply);
    }
  });

  client.login(TOKEN);
}
