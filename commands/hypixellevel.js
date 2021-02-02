module.exports = {
  name: 'hypixellevel',
  description: 'Shows someone\'s hypixel network level',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const index = require('../index');

    let skyblockJSON;
    let accountJSON;
    let apikey = process.env.apikey;
    if (!args[0]) return message.reply(`Incorrect command format! (${index.prefix}hypixellevel <name>)`);

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
      let result = await fetch(`https://api.hypixel.net/player?key=${apikey}&uuid=${accountData.id}`);
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
    if (skyblockData.player == null) {
      let embedMessage = new Discord.MessageEmbed()
        .setTitle('Unkown Player')
        .setDescription(`Looks like this player has never joined hypixel before!`)
        .setFooter(`User: ${accountData.name}`)
        .setColor('RED');
      message.channel.send(embedMessage);
      return;
    }

    const base = 10000;
    const growth = 2500;
    const reversePqPrefix = -(base - 0.5 * growth) / growth;
    const reverseConst = reversePqPrefix ** 2;

    const exp = skyblockData.player.networkExp;

    let levels = exp < 0 ? 1 : Math.floor((1 + reversePqPrefix + Math.sqrt(reverseConst + (2 / growth) * exp)) * 100) / 100;

    let embedMessage = new Discord.MessageEmbed()
      .setTitle('Account Found!')
      .setDescription(`${accountData.name}'s network level is ${levels} (${exp.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} total exp)`)
      .setColor('GREEN');
    message.channel.send(embedMessage);
  }
}