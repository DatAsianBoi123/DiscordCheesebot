const { Intents, Client } = require('discord.js/src/index.js');

const client = new Client({ intents: [Intents] })

client.on('ready', () => {
  console.log('Ready');
});

client.login(process.env.token);
