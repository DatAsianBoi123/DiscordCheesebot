import { Client, Intents } from 'discord.js';
import { TOKEN } from './config';

const client = new Client({ intents: Intents.FLAGS.GUILDS });

client.once('ready', async () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.login(TOKEN);
