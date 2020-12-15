module.exports = {
  name: 'profilelist',
  description: 'Shows all the skyblock profiles a user has',
  async execute() {
    const prefix = require('../index').prefix;

    let skyblockJSON;
    let accountJSON;
    let apikey = process.env.apikey;
    if (!args[0]) return message.reply(`Incorrect command format! (${prefix}profilelist <name>)`);

    let nameAPI = async () => {
      let result = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`);
      accountJSON = result.json().catch(() => {
        accountJSON = undefined;
      });
      return accountJSON;
    };
    let accountData = await nameAPI();
    if (accountJSON == undefined) return message.reply('This minecraft account doesn\'t exist');

    let skyblockAPI = async () => {
      let result = await fetch(`https://api.hypixel.net/skyblock/profiles?key=${apikey}&uuid=${accountData.id}`);
      skyblockJSON = result.json().catch(() => {
        skyblockJSON = undefined;
      });
      return skyblockJSON;
    };

    let skyblockData = await skyblockAPI();
    if (skyblockJSON == undefined || accountJSON == undefined || skyblockData.success == false) {
      message.reply(`An error occured`);
      return;
    }
    if (skyblockData.profiles == null) return message.reply(`Looks like this player has never joined skyblock before! (${accountData.name})`);

    let profiles = 'Profiles:';
    for (let i = 0; i < skyblockData.profiles.length; i++) {
      profiles += `\n${skyblockData.profiles[i].cute_name}`;
    }
    message.channel.send(profiles);

  }
}