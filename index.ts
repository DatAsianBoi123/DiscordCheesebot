import fs from 'fs';
import { Client, Collection, Intents, InteractionReplyOptions, TextChannel } from 'discord.js';
import { TOKEN } from './config';
import { ICommand } from './typings';

const client = new Client({ intents: Intents.FLAGS.GUILDS });

const commands = new Collection<string, ICommand>();
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

  console.log(`Registering command ${command.data.name} in file ${file}`);

  commands.set(command.data.name, command);
}

client.once('ready', async () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand() || !(interaction.channel instanceof TextChannel)) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.callback({ interaction: interaction, channel: interaction.channel, args: interaction.options, client: interaction.client, guild: interaction.guild, user: interaction.user });
  } catch (error) {
    console.error(error);

    const reply: InteractionReplyOptions = {
      content: 'There was an error executing this command',
    };

    interaction.replied ? interaction.editReply(reply) : interaction.reply(reply);
  }
});

client.login(TOKEN);
