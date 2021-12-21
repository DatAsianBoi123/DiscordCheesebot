import fs from 'fs';
import { Client, Collection, Intents, InteractionReplyOptions } from 'discord.js';
import { MONGO_PASS, TOKEN } from './config';
import { ICommand } from './typings';
import mongoose from 'mongoose';
import guildCommandModel from './models/guild-command-model';
import cache from './cache';

const client = new Client({ intents: Intents.FLAGS.GUILDS });

const uri = `mongodb+srv://DatAsianBoi123:${MONGO_PASS}@mydiscordbot.xudyc.mongodb.net/discord-bot?retryWrites=true&w=majority`;
mongoose.connect(uri).then(async () => {
  console.log('Connected to MongoDB');

  guildCommandModel.model.find({}, (err, allCommands) => {
    if (err) return console.error(err);

    cache.guildCommandCache.clear();

    for (const command of allCommands) {
      cache.guildCommandCache.set(command.id, command);
    }

    start();
  });
}).catch(() => console.log('An error occurred when connecting to MongoDB'));

async function start() {
  const commands = new Collection<string, ICommand>();
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
      console.log(`An error occurred when registering command ${command.data.name} in file ${file}: ${err.message}`);

      continue;
    }

    if (command.skip) {
      console.log(`Skipped command ${command.data.name}`);

      continue;
    }

    console.log(`Registered command ${command.data.name} in file ${file}`);

    commands.set(command.data.name, command);
  }

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
