module.exports = {
  name: 'skills',
  description: 'Shows information about a player\'s skyblock skills',
  disabled: false,
  category: 'Skyblock',
  async execute(message, args) {
    const Discord = require('discord.js');
    const fetch = require('node-fetch');
    const index = require('../index');

    let apikey = process.env.apikey;
    if (!args[1]) return message.reply(`Incorrect command format! (${index.prefix}skyblockskills <name> <profile name>)`);

    let nameAPI = async () => {
      let JSON;
      let result = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`);
      JSON = result.json().catch(() => {
        JSON = undefined;
      });
      return JSON;
    };
    let accountData = await nameAPI();
    if (accountData == undefined) return message.reply('This minecraft account doesn\'t exist');

    let skyblockAPI = async () => {
      let JSON;
      let result = await fetch(`https://api.hypixel.net/skyblock/profiles?key=${apikey}&uuid=${accountData.id}`);
      JSON = result.json().catch(() => {
        JSON = undefined;
      });
      return JSON;
    };

    let hypixelAPI = async () => {
      let JSON;
      let result = await fetch(`https://api.hypixel.net/player?key=${apikey}&uuid=${accountData.id}`);
      JSON = result.json().catch(() => {
        JSON = undefined;
      });
      return JSON;
    };

    let hypixelData = await hypixelAPI();
    let skyblockData = await skyblockAPI();
    if (skyblockData == undefined || accountData == undefined || hypixelData == undefined || skyblockData.success == false)
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

        if (member.experience_skill_combat == undefined) {
          let apiOffMessage = new Discord.MessageEmbed()
            .setTitle(`Displaying Skills for ${accountData.name} - ${profile.cute_name}:`)
            .setDescription('This person\'s api is turned off.')
            .setColor('YELLOW');
          message.channel.send(apiOffMessage);
          return;
        }

        skills.Combat = index.getLevelByXp(member.experience_skill_combat, achievements);
        skills.Foraging = index.getLevelByXp(member.experience_skill_foraging, achievements);
        skills.Mining = index.getLevelByXp(member.experience_skill_mining, achievements);
        skills.Fishing = index.getLevelByXp(member.experience_skill_fishing, achievements);
        skills.Farming = index.getLevelByXp(member.experience_skill_farming, achievements);
        skills.Alchemy = index.getLevelByXp(member.experience_skill_alchemy, achievements);
        skills.Enchanting = index.getLevelByXp(member.experience_skill_enchanting, achievements);
        skills.Taming = index.getLevelByXp(member.experience_skill_taming, achievements);
        skills.Carpentry = index.getLevelByXp(member.experience_skill_carpentry, achievements);
        skills.Runecrafting = index.getLevelByXp(member.experience_skill_runecrafting, achievements, 'runecrafting');

        let skillAvgWithoutProgress = 0;
        let skillAvgWithProgress = 0;
        let skillText = '';
        for (let skill in skills) {
          if (skills[skill].level == skills[skill].maxLevel) {
            skills[skill].format = `${index.nFormatter(skills[skill].xpCurrent)} xp\nMAX LEVEL`;
          } else {
            skills[skill].format = `${Math.floor(skills[skill].progress * 100)}% to ${skill.toLowerCase()} ${skills[skill].level + 1}\n(${index.nFormatter(skills[skill].xpCurrent)} / ${index.nFormatter(skills[skill].xpForNext)} xp)`;
          }
          if (skill == 'Runecrafting' || skill == 'Carpentry') continue;
          skillAvgWithoutProgress += skills[skill].level;
          skillAvgWithProgress += skills[skill].level + skills[skill].progress;
        }

        skillText += `\nSkill average without progress: ${Math.round((skillAvgWithoutProgress / (Object.keys(skills).length - 2)) * 100) / 100}\nSkill average with progress: ${Math.round((skillAvgWithProgress / (Object.keys(skills).length - 2)) * 100) / 100}`;

        let embedMessage = new Discord.MessageEmbed()
          .setTitle(`Displaying Skills for ${accountData.name} - ${profile.cute_name}:`)
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