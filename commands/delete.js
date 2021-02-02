module.exports = {
  name: 'delete',
  description: 'Deletes a set amount of messages',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const Discord = require('discord.js');
    const index = require('../index');

    let deleteNumber = Math.floor(parseFloat(args[0]));

    if (isNaN(parseInt(args[0]))) return message.reply(`Incorrect command format! \n(${index.prefix}delete <amount>)`);
    if (parseInt(deleteNumber) > 99) return message.reply("You cannot delete more than 99 messages at a time!");
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have permission to use this command!");

    message.channel.bulkDelete(parseInt(deleteNumber) + 1).then(() => {
      if (args[1] == "true" || args[1] == null) {
        if (parseInt(deleteNumber) == 1) message.channel.send(`Successfully deleted \`\`${parseInt(deleteNumber)}\`\` message!`);
        else message.channel.send(`Successfully deleted \`\`${parseInt(deleteNumber)}\`\` messages!`);
      }
    }).catch(() => {
      message.reply('An error occured (You can only delete messages that are under 14 days old)');
    });
  }
}