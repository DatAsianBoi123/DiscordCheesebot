import { BurgerClient } from './api/burger-client';
import fs from 'fs';
import { ICommand } from './typings';
import { CLIENT_ID, GUILD_ID, TOKEN } from './config';

const allCommands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  let command: ICommand;

  try {
    command = require(`./commands/${file}`);
  } catch (err) {
    BurgerClient.logger.log(`An error occurred when registering the command in file ${file}: ${err.message}`, 'ERROR');
    continue;
  }

  if (!BurgerClient.isValid(command)) {
    BurgerClient.logger.log(`The command ${file} is not registered correctly.`, 'WARNING');
    continue;
  }

  if (command.skip) {
    BurgerClient.logger.log(`Skipped command ${command.data.name}.`);
    continue;
  }

  allCommands.push(command);
}

BurgerClient.deployCommands({
  guildId: GUILD_ID,
  token: TOKEN,
  userId: CLIENT_ID,
}, allCommands);
