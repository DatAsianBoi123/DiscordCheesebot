import { ActivityType, GatewayIntentBits, InteractionType, Partials } from 'discord.js';
import { GUILD_ID, MONGO_URI, TOKEN } from './config';
import * as config from './config';
import { BurgerClient } from './api/burger-client';

for (const key of (Object.keys(config) as (keyof typeof config)[])) {
  if (!config[key]) throw new Error(`Config var ${key} does not exist`);
}

const client = new BurgerClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel],
  testGuild: GUILD_ID as string,
  mongoURI: MONGO_URI,
});

client.onReady(async () => {
  client.registerAllCommands('./commands');
  await client.updatePermissions();

  client.user?.setActivity({ name: 'everything', type: ActivityType.Watching });

  BurgerClient.logger.log(`Ready! Logged in as ${client.user?.tag}`);

});

client.on('interactionCreate', async interaction => {
  if (interaction.type !== InteractionType.ApplicationCommand) return;
  if (!interaction.isChatInputCommand()) return;

  await client.resolveCommand(interaction);
});

client.login(TOKEN as string);
