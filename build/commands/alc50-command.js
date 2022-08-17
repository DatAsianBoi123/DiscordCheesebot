"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const config_1 = require("../config");
const node_fetch_1 = __importDefault(require("node-fetch"));
const discord_js_1 = require("discord.js");
const skyblock_skill_util_1 = require("../util/skyblock-skill-util");
const number_util_1 = require("../util/number-util");
const command = {
    data: new builders_1.SlashCommandBuilder()
        .setName('alc50')
        .setDescription('Shows how much xp is needed for alchemy 50, as well as cost')
        .addStringOption(option => {
        return option.setName('player')
            .setDescription('The name of the player')
            .setRequired(true);
    })
        .addStringOption(option => {
        return option.setName('profile')
            .setDescription('The player\'s profile')
            .setRequired(false);
    }),
    type: 'GLOBAL',
    listeners: {
        onExecute: async ({ interaction, args }) => {
            await interaction.deferReply();
            const mojangData = await (0, node_fetch_1.default)(`https://api.mojang.com/users/profiles/minecraft/${args.getString('player')}`);
            if (mojangData.status === 204) {
                await interaction.editReply(`The player ${args.getString('player')} was not found`);
                return;
            }
            const mojangJSON = await mojangData.json();
            const hypixelData = await (0, node_fetch_1.default)(`https://api.hypixel.net/skyblock/profiles?uuid=${mojangJSON.id}&key=${config_1.API_KEY}`);
            const hypixelJSON = await hypixelData.json();
            if (!hypixelJSON.success) {
                const errorEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle('Error')
                    .setDescription(`Code: **${hypixelData.status}**\nReason: ${hypixelJSON.cause}`)
                    .setColor('Red');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }
            if (!hypixelJSON.profiles || hypixelJSON.profiles.length < 1) {
                await interaction.editReply('That player never joined skyblock');
                return;
            }
            let profile = hypixelJSON.profiles[0];
            const profileArgument = args.getString('profile');
            if (profileArgument) {
                const foundProfile = hypixelJSON.profiles.find((playerProfile) => playerProfile.cute_name.toLowerCase() === profileArgument.toLowerCase());
                if (!foundProfile) {
                    const errorEmbed = new discord_js_1.EmbedBuilder()
                        .setTitle('Error')
                        .setDescription(`Code: **404**\nReason: The profile ${args.getString('profile')} was not found.`)
                        .setTimestamp()
                        .setColor('Red');
                    await interaction.editReply({ embeds: [errorEmbed] });
                    return;
                }
                profile = foundProfile;
            }
            const player = profile.members[mojangJSON.id];
            const alchemyXp = player.experience_skill_alchemy ?? 0;
            let icon = '';
            switch (profile.game_mode) {
                case 'bingo':
                    icon = ':game_die:';
                    break;
                case 'ironman':
                    icon = '<:ironman:932021735639891968>';
                    break;
                case 'island':
                    icon = ':island:';
                    break;
            }
            const skillEmbed = new discord_js_1.EmbedBuilder()
                .setTitle(`Displaying Alchemy Stats for ${icon}${mojangJSON.name}`)
                .addFields({ name: `Alchemy ${skyblock_skill_util_1.SkillsUtil.getLevel(alchemyXp, 'ALCHEMY')}`, value: `${number_util_1.NumberUtil.format(alchemyXp, 2)} / ${number_util_1.NumberUtil.format(skyblock_skill_util_1.SkillsUtil.getXpForLevel(50), 2)} XP (${Math.round((alchemyXp / skyblock_skill_util_1.SkillsUtil.getXpForLevel(50)) * 10000) / 100}%) to Alchemy 50` })
                .setColor('Purple')
                .setFooter({ text: `Profile: ${profile.cute_name}` })
                .setTimestamp(Date.now());
            interaction.editReply({ embeds: [skillEmbed] });
        },
    },
};
module.exports = command;
//# sourceMappingURL=alc50-command.js.map