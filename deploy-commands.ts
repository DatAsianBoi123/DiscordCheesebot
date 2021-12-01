import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { TOKEN, CLIENT_ID, GUILD_ID } from './config';
import { ICommand } from './typings';

const commands = [];
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
    console.log(`An error occured when registering command ${command.data.name} in file ${file}: ${err.message}`);

    continue;
  }

  if (command.skip) {
    console.log(`Skipped command ${command.data.name}`);

    continue;
  }

  console.log(`Registering command ${command.data.name} in file ${file}`);

  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

if (process.argv.slice(2)[0] == '--global') {
  rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
} else {
  rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
    .then(() => console.log('Successfully registered guild application commands.'))
    .catch(console.error);
}
