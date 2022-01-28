import fs from 'fs';
import { Client, Intents } from 'discord.js';
import { GUILD_ID, MONGO_PASS, TOKEN } from './config';
import { BurgerClient } from './api/burger-client';
import { ICommand } from './typings';

const client = new Client({ intents: Intents.FLAGS.GUILDS });

let burgerClient: BurgerClient;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

client.once('ready', async () => {
  burgerClient = new BurgerClient(client, {
    guildId: GUILD_ID,
    mongoURI: `mongodb+srv://DatAsianBoi123:${MONGO_PASS}@mydiscordbot.xudyc.mongodb.net/discord-bot?retryWrites=true&w=majority`,
  });

  for (const file of commandFiles) {
    let command: ICommand;

    try {
      command = require(`./commands/${file}`);
    } catch (err) {
      BurgerClient.logger.log(`An error occurred when registering the command in file ${file}: ${err.message}`, 'ERROR');
      continue;
    }

    burgerClient.registerCommand(command, file);
  }

  console.log(`Ready! Logged in as ${client.user.tag}`);

  client.user.setActivity({ name: 'everything', type: 'WATCHING' });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  await burgerClient.resolveCommand(interaction);
});

client.login(TOKEN);
