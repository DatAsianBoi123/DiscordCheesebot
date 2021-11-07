const {
  Client,
  Intents,
} = require('discord.js');
const WOKCommands = require('wokcommands');
const {
  VERSION,
  TOKEN,
  CLIENT_ID
} = require('./api/constants');
const path = require('path');
const {
  REST
} = require('@discordjs/rest/dist/lib/REST');
const {
  Routes
} = require('discord-api-types/v9');
const {
  argv
} = require('process');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

console.log(`Starting... v${VERSION}`);

client.on('ready', () => {
  if (argv[2] == 'removecommands') {
    console.log('Removing commands...');
    removeAllCommands().then(() => {
      console.log('Done. Restart');
    });
  } else {
    setupWOKCommands();
  }
});

function setupWOKCommands() {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    testServers: ['738961884853829703']
  }).setCategorySettings([{
    name: 'SMP',
    emoji: '👌'
  }]);
}

async function removeAllCommands() {
  const rest = new REST({
    version: '9'
  }).setToken(TOKEN);
  rest.get(Routes.applicationGuildCommands(CLIENT_ID, '738961884853829703')).then(data => {
    const promises = [];
    for (const command of data) {
      const deleteUrl = `${Routes.applicationGuildCommands(CLIENT_ID, '738961884853829703')}/${command.id}`;
      promises.push(rest.delete(deleteUrl));
    }
    return Promise.all(promises);
  });
}

client.login(TOKEN);
