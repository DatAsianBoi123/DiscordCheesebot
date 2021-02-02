module.exports = {
  name: 'verify',
  description: 'Verifies your discord user to your minecraft account',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const index = require('../index');

    if (!args[0]) return message.reply(`Incorrect command format! \n(${index.prefix}verify <name>)`);
    let json;

    let embedVerification;

    let nameAPI = async () => {
      let result = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`);
      json = result.json().catch(() => {
        json = undefined;
        embedVerification = new Discord.MessageEmbed()
          .setTitle('Name not found')
          .setDescription('It seems like this minecraft account does not exist!')
          .setColor('RED');
        return message.channel.send(embedVerification);
      });
      return json;
    };
    let name = await nameAPI();
    if (json == undefined) return;

    const data = await index.getDataByType('Verify', 'verify');

    for (let i = 0; i < Object.keys(data.users).length; i++) {
      const keys = Object.keys(data.users);

      if (keys[i] == message.author.id && keys[i] != null) return message.reply('You have already verified! If you want to verify again, please contact a staff member.')
      else if (data.users[keys[i]] == name.id && keys[i] != null) return message.reply('This account has already been taken! If you think someone else has verified as you, please contact a staff member.');
    }

    let object = {};
    object.users = data.users;
    object.users[message.author.id] = name.id;

    embedVerification = new Discord.MessageEmbed()
      .setTitle('Verification Successful!')
      .setDescription('This minecraft accound was found!')
      .setColor('GREEN')
      .setFooter(`Name: ${name.name}, ID: ${name.id}`);

    index.updateById(data._id, 'verify', object);
    message.channel.send(`<@${message.author.id}>`);
    message.channel.send(embedVerification);

    let verified = message.guild.roles.cache.get('772656381403594762');
    let unverified = message.guild.roles.cache.get('788543788540362822');
    message.member.roles.add(verified);
    message.member.roles.remove(unverified);
  }
}