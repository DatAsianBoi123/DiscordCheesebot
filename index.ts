import { Intents } from 'discord.js';
import { GUILD_ID, MONGO_URI, TOKEN } from './config';
import { BurgerClient } from './api/burger-client';

const client = new BurgerClient([Intents.FLAGS.GUILDS], {
  guildId: GUILD_ID,
  adminRoleId: '738963940712906793',
  mongoURI: MONGO_URI,
});

client.onReady(async () => {
  client.registerAllCommands('./commands');

  client.user.setActivity({ name: 'everything', type: 'WATCHING' });

  BurgerClient.logger.log(`Ready! Logged in as ${client.user.tag}`);

// burgerClient.updatePermissions();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  await client.resolveCommand(interaction);
});

client.login(TOKEN);
