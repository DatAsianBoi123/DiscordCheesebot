import { Intents } from 'discord.js';
import { GUILD_ID, MONGO_PASS, TOKEN } from './config';
import { BurgerClient } from './api/burger-client';

const client = new BurgerClient([Intents.FLAGS.GUILDS], {
  guildId: GUILD_ID,
  adminRoleId: '738963940712906793',
  mongoURI: `mongodb+srv://DatAsianBoi123:${MONGO_PASS}@mydiscordbot.xudyc.mongodb.net/discord-bot?retryWrites=true&w=majority`,
});

client.onReady(async () => {
  client.registerAllCommands('./commands');

  client.user.setActivity({ name: 'everything', type: 'WATCHING' });

  // burgerClient.updatePermissions();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  await client.resolveCommand(interaction);
});

client.login(TOKEN);
