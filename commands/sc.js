module.exports = {
  name: 'sc',
  description: 'Shows a link to a player\'s skycrypt',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const prefix = require('../index').prefix;

    if (!args[0]) return message.reply(`Incorrect command format! \n(${prefix}skylea <player name> [profile name])`);
    if (!args[1]) message.channel.send(`https://sky.shiiyu.moe/stats/${args[0]}`);
    else message.channel.send(`https://sky.shiiyu.moe/stats/${args[0]}/${args[1]}`);
  }
}