console.log('Starting...');

const { Client, Intents } = require('discord.js');
const fs = require('fs');
const { CommandBase } = require('./api/command-base');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

/**
 * @type { CommandBase[] }
 */
const allCommands = [];

client.on('ready', () => {
  console.log('Ready');

  const guildId = '738961884853829703';
  const guild = client.guilds.cache.get(guildId);
  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application.commands;
  }

  const commandFiles = fs.readdirSync('./commands', file => file.endsWith('.js'));
  for (const command of commandFiles) {
    /**
     * @type { CommandBase }
     */
    const cmd = require(`./commands/${command}`);

    allCommands.push(cmd);
    commands.create(cmd.command);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  for (const command of allCommands) {
    if (command.command.name == interaction.commandName) {
      if (command.permission) {
        console.log('Permission exists');
        if (!interaction.memberPermissions.any(command.permission)) {
          console.log('Does not have permission');
          interaction.reply({ content: 'You do not have permission to execute this command.', ephemeral: true });
          break;
        }
      }

      console.log(interaction.memberPermissions.toArray());

      command.execute(interaction);

      break;
    }
  }
});

client.login(process.env.token);
