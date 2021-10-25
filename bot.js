console.log('Starting...');

const { Client, Intents } = require('discord.js');
const fs = require('fs');

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
    const cmd = require(`./commands/${command}`);

    allCommands.push(cmd.name);
    commands.create(cmd);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName, options } = interaction;

  if (commandName === 'ping') {
    interaction.reply({
      content: String(Date.now() - interaction.createdTimestamp)
    });
  } else if (commandName === 'say') {
    interaction.channel.send(options.getString('message'));

    interaction.reply({
      content: 'Done!',
      ephemeral: true
    });
  }
});

client.login(process.env.token);
