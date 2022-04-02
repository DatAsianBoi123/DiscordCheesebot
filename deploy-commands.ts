import { BurgerClient } from './api/burger-client';
import { CLIENT_ID, GUILD_ID, TOKEN } from './config';

BurgerClient.deployCommands({
  guildId: GUILD_ID,
  token: TOKEN,
  userId: CLIENT_ID,
}, BurgerClient.allCommandsInDir('./commands')).then(() => {
  console.log('Done');
  process.exit(0);
});
