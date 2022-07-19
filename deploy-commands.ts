import { BurgerClient } from 'burgerclient';
import { CLIENT_ID, GUILD_ID, TOKEN } from './config';

const commands = BurgerClient.allCommandsInDir('./commands', true);

if (commands === null) process.exit(1);

BurgerClient.deployCommands({
  guildId: GUILD_ID as string,
  token: TOKEN as string,
  userId: CLIENT_ID as string,
}, commands).then(() => {
  BurgerClient.logger.log('Done!');
});
