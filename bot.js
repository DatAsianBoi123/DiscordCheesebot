console.log('Starting...');

const { Client, Intents } = require('discord.js');
const fs = require('fs');
const { CommandBase } = require('./api/command-base');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

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

    allCommands.push(cmd.command.name);
    commands.create(cmd.command);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  for (const commandName of allCommands) {
    console.log(`Looping through all commands... ${commandName} == ${allCommands} ?`);
    if (commandName == interaction.commandName) {
      console.log(`Found a match! ${commandName}`);
      /**
       * @type { CommandBase }
       */
      const command = require(`./commands/${commandName}`);

      command.execute(interaction);

      break;
    }
  }

  console.log('No command matches');
});

client.login(process.env.token);
