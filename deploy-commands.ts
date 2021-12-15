import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { TOKEN, CLIENT_ID, GUILD_ID } from './config';
import { ICommand } from './typings';

console.log('Reloading commands...');

const guildCommands = [];
const globalCommands = [];
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

  console.log(`Registering ${command.type.toLowerCase()} command ${command.data.name} in file ${file}`);

  command.type === 'GLOBAL' ? globalCommands.push(command.data.toJSON()) : guildCommands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

registerCommands()
  .then(() => console.log('Done'));

async function registerCommands() {
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: guildCommands })
    .then((data) => console.log(`Successfully registered ${guildCommands.length} guild commands`, data))
    .catch(() => console.log('An error occured when registering guild commands'));

  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: globalCommands })
    .then(() => console.log(`Successfully registered ${globalCommands.length} global commands`))
    .catch(() => console.log('An error occured when registering global commands'));
}
