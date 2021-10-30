const {
  Client,
  Intents,
  GuildApplicationCommandManager,
} = require('discord.js');
const ApplicationCommandManager = require('discord.js/src/managers/ApplicationCommandManager.js');
const fs = require('fs');
const {
  CommandBase
} = require('./api/command-base');
const {
  VERSION,
  ALL_COMMANDS
} = require('./api/constants');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const guildId = '738961884853829703';
const guild = client.guilds.cache.get(guildId);

console.log(`Starting... v${VERSION}`);

client.on('ready', () => {
  console.log('Ready');

  EditAndCreateCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  for (const command of ALL_COMMANDS) {
    if (command[1].command.name == interaction.commandName) {
      if (command[1].permission) {
        if (!interaction.memberPermissions.has(command[1].permission)) {
          interaction.reply({
            content: 'You do not have permission to execute this command.',
            ephemeral: true
          });
          break;
        }
      }

      command[1].execute(interaction);

      break;
    }
  }
});

/**
 * @returns { GuildApplicationCommandManager | ApplicationCommandManager }
 */
const getCommands = () => {
  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application.commands;
  }

  return commands;
}

const createCommands = async () => {
  const commands = getCommands();

  console.log(`Registering new commands...`);

  const commandFiles = fs.readdirSync('./commands', file => file.endsWith('.js'));
  for (const command of commandFiles) {
    /**
     * @type { CommandBase }
     */
    const cmd = require(`./commands/${command}`);

    await commands.create(cmd.command).then(commandData => {
      ALL_COMMANDS.set(commandData.id, cmd);
    });
    console.log(`Created command ${cmd.command.name}`);
  }

  console.log('Done!');
}

async function EditAndCreateCommands() {
  const commands = getCommands();

  const commandFiles = fs.readdirSync('./commands', file => file.endsWith('.js'));
  for (const command of commandFiles) {
    let edited = false;
    /**
     * @type { CommandBase }
     */
    const cmd = require(`./commands/${command}`);

    await commands.fetch().then(async commandData => {
      for (const applicationCommand of commandData) {
        if (applicationCommand[1].name == cmd.command.name) {
          await commands.edit(applicationCommand[1], cmd.command).then(application => {
            ALL_COMMANDS.set(application.id, cmd);

            console.log(`Edited command ${cmd.command.name}`);
          }).catch(() => {
            console.log(`An error occured when editing the command ${cmd.command.name}`);
          });

          edited = true;
        }
      }
    });

    if (edited) {
      continue;
    }

    await commands.create(cmd.command).then(commandData => {
      ALL_COMMANDS.set(commandData.id, cmd);
    });

    console.log(`Created command ${cmd.command.name}`);
  }

  console.log(`Deleting commands...`);

  await commands.fetch().then(async commandData => {
    for (const commandDataKey of commandData.keys()) {
      let isSame = false;

      for (const commandKey of ALL_COMMANDS.keys()) {
        if (commandDataKey == commandKey) {
          isSame = true;

          break;
        }
      }

      if (!isSame) {
        await commands.delete(commandDataKey);

        console.log(`Deleted command ${commandData.get(commandDataKey).name}`);
      }
    }
  });

  console.log(`${ALL_COMMANDS.size} total commands`);

  console.log('Done!');
}

async function DeleteAllCommands() {
  const commands = getCommands();

  commands.set([]).then(() => {
    console.log(`Done!`);
  });
}

async function CreateButDontRegisterCommands() {
  const commands = getCommands();

  const commandFiles = fs.readdirSync('./commands', file => file.endsWith('.js'));
  for (const command of commandFiles) {
    /**
     * @type { CommandBase }
     */
    const cmd = require(`./commands/${command}`);

    console.log(`Registering with id ${commands.resolveId(cmd.command)}`);
    ALL_COMMANDS.set(commands.resolveId(cmd.command), cmd);
  }

  console.log(`Created ${commandFiles.length} commands.`);
}

module.exports = {
  client,
  guildId,
  createCommands,
  getCommands
}

// process.env.token
client.login(process.env.token);
