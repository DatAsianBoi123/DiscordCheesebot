module.exports = {
  name: 'addpoll',
  description: 'Creates a poll',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const index = require('../index');

    let channelName = message.mentions.channels.first();

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
    if (!args[1]) return message.reply(`Incorrect command format! \n(${index.prefix}addpoll <#channel> <poll>`);
    if (channelName == undefined) return message.reply(`Incorrect command format! \n(${index.prefix}addpoll <#channel> <poll>`);

    let embedPoll = new Discord.MessageEmbed()
      .setTitle('Poll:')
      .setDescription(args.slice(1).join(' '))
      .setColor('YELLOW');

    if (PollID != undefined) {
      channelName.send(`<@&${PollID}>`);
    }
    let msg = await channelName.send(embedPoll).catch(() => {
      return message.reply('An error occured');
    });
    await msg.react(':upvote:758527296071794718');
    await msg.react(':downvote:758527282532319263');

    break;
  }
}