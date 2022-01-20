import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { TOKEN, CLIENT_ID, GUILD_ID, MONGO_PASS } from './config';
import { ICommand } from './typings';
import mongoose from 'mongoose';
import guildCommandModel from './models/guild-command-model';

console.log('Reloading commands...');

const guildCommands = [];
const globalCommands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  let command: ICommand = null;

  try {
    command = require(`./commands/${file}`);

    if (!command?.data || !command?.type || !command?.listeners?.onExecute) {
      console.log(`Command in file ${file} is not registered correctly, skipping`);

      continue;
    }
  } catch (err) {
    console.log(`An error occurred when registering command ${command.data.name} in file ${file}: ${err.message}`);

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

registerGuildApplicationCommands().then(() => {
  console.log('Successful!');
}).catch(err => {
  console.log('Oops, and error occurred');
  console.error(err);
});

async function registerGuildApplicationCommands() {
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: guildCommands })
    .then(async (data) => {
      console.log(`Successfully registered ${guildCommands.length} guild commands`);

      const uri = `mongodb+srv://DatAsianBoi123:${MONGO_PASS}@mydiscordbot.xudyc.mongodb.net/discord-bot?retryWrites=true&w=majority`;

      mongoose.connect(uri).then(async () => {
        console.log('Connected to MongoDB');

        await guildCommandModel.model.deleteMany({});

        if (data instanceof Array) {
          for (const command of data) {
            const document = new guildCommandModel.model(command);

            await document.save();
          }

          console.log('Updated MongoDB');

          await registerGlobalApplicationCommands();
        }
      }).catch(() => console.log('Error occurred when connecting to MongoDB'));
    })
    .catch(() => console.log('An error occurred when registering guild commands'));
}

async function registerGlobalApplicationCommands() {
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: globalCommands })
    .then(() => console.log(`Successfully registered ${globalCommands.length} global commands`))
    .catch(() => console.log('An error occurred when registering global commands'));
}
