module.exports = {
  name: 'skyblockskills',
  description: 'Shows information about a player\'s skyblock skills',
  disabled: false,
  category: 'General',
  async execute(message, args) {

    let skyblockJSON;
    let accountJSON;
    let hypixelJSON;
    let apikey = process.env.apikey;
    if (!args[1]) return message.reply(`Incorrect command format! (${prefix}skyblockskills <name> <profile name>)`);

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
        const skills = {
          'Combat': 0,
          'Foraging': 0,
          'Mining': 0,
          'Fishing': 0,
          'Farming': 0,
          'Alchemy': 0,
          'Enchanting': 0,
          'Taming': 0,
          'Carpentry': 0,
          'Runecrafting': 0
        };

        skills.Combat = getLevelByXp(member.experience_skill_combat, achievements);
        skills.Foraging = getLevelByXp(member.experience_skill_foraging, achievements);
        skills.Mining = getLevelByXp(member.experience_skill_mining, achievements);
        skills.Fishing = getLevelByXp(member.experience_skill_fishing, achievements);
        skills.Farming = getLevelByXp(member.experience_skill_farming, achievements);
        skills.Alchemy = getLevelByXp(member.experience_skill_alchemy, achievements);
        skills.Enchanting = getLevelByXp(member.experience_skill_enchanting, achievements);
        skills.Taming = getLevelByXp(member.experience_skill_taming, achievements);
        skills.Carpentry = getLevelByXp(member.experience_skill_carpentry, achievements);
        skills.Runecrafting = getLevelByXp(member.experience_skill_runecrafting, achievements, 'runecrafting');

        let skillAvgWithoutProgress = 0;
        let skillAvgWithProgress = 0;
        let skillText = '';
        for (let skill in skills) {
          skills[skill].format = `${Math.floor(skills[skill].progress * 100)}% to ${skill.toLowerCase()} ${skills[skill].level + 1}\n(${nFormatter(skills[skill].xpCurrent)} / ${nFormatter(skills[skill].xpForNext)} xp)`;
          if (skill == 'Runecrafting' || skill == 'Carpentry') continue;
          skillAvgWithoutProgress += skills[skill].level;
          skillAvgWithProgress += skills[skill].level + skills[skill].progress;
        }

        skillText += `\nSkill average without progress: ${Math.round((skillAvgWithoutProgress / (Object.keys(skills).length - 2)) * 100) / 100}\nSkill average with progress: ${Math.round((skillAvgWithProgress / (Object.keys(skills).length - 2)) * 100) / 100}`;

        let embedMessage = new Discord.MessageEmbed()
          .setTitle('Profile Found!')
          .addFields(
            { name: `Combat ${skills.Combat.level}`, value: skills.Combat.format, inline: true },
            { name: `Foraging ${skills.Foraging.level}`, value: skills.Foraging.format, inline: true },
            { name: `Mining ${skills.Mining.level}`, value: skills.Mining.format, inline: true },
            { name: `Fishing ${skills.Fishing.level}`, value: skills.Fishing.format, inline: true },
            { name: `Farming ${skills.Farming.level}`, value: skills.Farming.format, inline: true },
            { name: `Alchemy ${skills.Alchemy.level}`, value: skills.Alchemy.format, inline: true },
            { name: `Enchanting ${skills.Enchanting.level}`, value: skills.Enchanting.format, inline: true },
            { name: `Taming ${skills.Taming.level}`, value: skills.Taming.format, inline: true },
            { name: `Carpentry ${skills.Carpentry.level}`, value: skills.Carpentry.format, inline: true },
            { name: `Runecrafting ${skills.Runecrafting.level}`, value: skills.Runecrafting.format, inline: true }
          )
          .setDescription(skillText)
          .setFooter(`User: ${accountData.name}, Profile: ${profile.cute_name}`)
          .setColor('GREEN');
        message.channel.send(embedMessage);
        return;
      }
    }
    let embedMessage = new Discord.MessageEmbed()
      .setTitle('Unknown Profile')
      .setDescription(`This profile doesn't exist on this user!`)
      .setFooter(`User: ${accountData.name}, Profile: ${args[1]}`)
      .setColor('RED');
    message.reply(embedMessage);
  }
}