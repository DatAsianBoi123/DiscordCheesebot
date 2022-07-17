import { BurgerClient } from './api/burger-client';
import { CLIENT_ID, GUILD_ID, TOKEN } from './config';

const commands = BurgerClient.allCommandsInDir('./commands');

if (commands === null) process.exit(1);

BurgerClient.deployCommands({
  guildId: GUILD_ID as string,
  token: TOKEN as string,
  userId: CLIENT_ID as string,
}, commands).then(() => {
  BurgerClient.logger.log('Done!');
  process.exit(0);
});
