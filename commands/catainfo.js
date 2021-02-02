module.exports = {
  name: 'catainfo',
  description: 'Shows information about a player\'s catacombs',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    const index = require('../index');

    let skyblockJSON;
    let accountJSON;
    let hypixelJSON;
    let apikey = process.env.apikey;
    if (!args[1]) return message.reply(`Incorrect command format! (${index.prefix}catainfo <name> <profile name>)`);

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

        let classLevels = {
          berserk: 0,
          archer: 0,
          mage: 0,
          tank: 0,
          healer: 0
        };
        let cataLevels = 0;
        cataLevels = index.getLevelByXp(catacombs.experience, achievements, 'dungeon');
        for (let dungeon_class in dungeon.player_classes) {
          classLevels[dungeon_class] = index.getLevelByXp(dungeon.player_classes[dungeon_class].experience, achievements, 'dungeon');
          classLevels[dungeon_class].format = `${Math.floor(classLevels[dungeon_class].progress * 100)}% to ${dungeon_class.toLowerCase()} ${classLevels[dungeon_class].level + 1}\n(${index.nFormatter(classLevels[dungeon_class].xpCurrent)} / ${index.nFormatter(classLevels[dungeon_class].xpForNext)} xp)`;
        }
        let embedMessage = new Discord.MessageEmbed()
          .setTitle('Profile Found!')
          .addFields(
            { name: `Cata ${cataLevels.level}`, value: `${Math.floor(cataLevels.progress * 100)}% to catacombs ${cataLevels.level + 1} (${index.nFormatter(cataLevels.xpCurrent)} / ${index.nFormatter(cataLevels.xpForNext)} xp)`},
            { name: `Berserk ${classLevels.berserk.level}`, value: `${classLevels.berserk.format}`, inline: true },
            { name: `Archer ${classLevels.archer.level}`, value: `${classLevels.archer.format}`, inline: true },
            { name: `Mage ${classLevels.mage.level}`, value: `${classLevels.mage.format}`, inline: true },
            { name: `Tank ${classLevels.tank.level}`, value: `${classLevels.tank.format}`, inline: true },
            { name: `Healer ${classLevels.healer.level}`, value: `${classLevels.healer.format}`, inline: true }
          )
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