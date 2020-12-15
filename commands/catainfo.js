module.exports = {
  name: 'catainfo',
  description: 'Shows information about a player\'s catacombs',
  async execute() {
    const prefix = require('../index').prefix;

    let skyblockJSON;
    let accountJSON;
    let hypixelJSON;
    let apikey = process.env.apikey;
    if (!args[1]) return message.reply(`Incorrect command format! (${prefix}catainfo <name> <profile name>)`);

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

    let hypixelAPI = async () => {
      let result = await fetch(`https://api.hypixel.net/player?key=${apikey}&uuid=${accountData.id}`);
      hypixelJSON = result.json().catch(() => {
        skyblockJSON = undefined;
      });
      return hypixelJSON;
    };


    let hypixelData = await hypixelAPI();
    let skyblockData = await skyblockAPI();
    if (skyblockJSON == undefined || accountJSON == undefined || hypixelJSON == undefined || skyblockData.success == false)
      return message.reply(`An error occured`);
    if (skyblockData.profiles == null) return message.reply(`Looks like this player has never joined skyblock before! (${accountData.name})`);

    for (let i = 0; i < skyblockData.profiles.length; i++) {
      const profile = skyblockData.profiles[i];
      if (profile.cute_name.toLowerCase() == args[1].toLowerCase()) {
        const member = profile.members[accountData.id];
        const achievements = hypixelData.player.achievements;
        const dungeon = member.dungeons;
        const catacombs = dungeon.dungeon_types.catacombs;

        let classLevels = '';
        for (let i = 0; i < Object.keys(dungeon.player_classes).length; i++) {
          keys = Object.keys(dungeon.player_classes);
          classLevels += `${keys[i]} level ${getLevelByXp(dungeon.player_classes[keys[i]].experience, achievements, 'dungeon').level}\n\n`;
        }
        classLevels.replace(/\n+$/, "");
        let embedMessage = new Discord.MessageEmbed()
          .setTitle('Profile Found!')
          .setDescription(`Cata level ${getLevelByXp(catacombs.experience, achievements, 'dungeon').level}\n----------------\n${classLevels}`)
          .setFooter(`User: ${accountData.name}, Profile: ${profile.cute_name}`)
          .setColor('GREEN');
        message.channel.send(embedMessage);
        return;
      }
    }
    let embedMessage = new Discord.MessageEmbed()
      .setTitle('Unknown Profile')
      .setDescription('This profile doesn\'t exist on this user!')
      .setFooter(`User: ${accountData.name}, Profile: ${args[1]}`)
      .setColor('RED');
    message.reply(embedMessage);
  }
}