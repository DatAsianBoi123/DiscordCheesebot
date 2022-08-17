"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const number_util_1 = require("../util/number-util");
const node_fetch_1 = __importDefault(require("node-fetch"));
const command = {
    data: new builders_1.SlashCommandBuilder()
        .setName('weight')
        .setDescription('Calculates how much your purse weighs')
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
            const coinData = {
                goldMetersPerIngot: 1 / 9,
                goldIngotsPerCoin: 0.25,
                weightOfGoldMeterInKilo: 19300,
            };
            const miscellaneous = {
                planeWeight: 200000,
            };
            const stages = {
                Chad: 1000000000000,
                Ripped: 10000000000,
                Buff: 50000000,
                Strong: 5000000,
                Average: 800000,
                Weak: 100000,
                Nerd: 10000,
                'Are you even trying?': 0,
            };
            const coins = profile.members[mojangJSON.id].coin_purse;
            const purseWeight = coinData.goldIngotsPerCoin * coins * coinData.goldMetersPerIngot * coinData.weightOfGoldMeterInKilo;
            let stage = 'Are you even trying?';
            for (stage in stages) {
                if (purseWeight >= stages[stage])
                    break;
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`${mojangJSON.name}'s Asian Weight on ${profile.cute_name}`)
                .setDescription(`Purse Weight: **${number_util_1.NumberUtil.format(purseWeight, 3)} kilograms** (Thats about **${Math.round(purseWeight / miscellaneous.planeWeight).toLocaleString('en-US')} planes** in your purse!)\nStage: **${stage}**`)
                .setThumbnail(`https://mc-heads.net/body/${mojangJSON.id}`)
                .addFields({ name: 'Variables Used', value: `Gold Ingots per Coin: ${coinData.goldIngotsPerCoin}\nGold Blocks per Ingot: ${(coinData.goldMetersPerIngot).toFixed(2)}\nWeight of Gold Block: ${coinData.weightOfGoldMeterInKilo.toLocaleString('en-US')}kg` })
                .setColor('Green')
                .setTimestamp();
            interaction.editReply({ embeds: [embed] });
        },
    },
};
module.exports = command;
//# sourceMappingURL=weight-command.js.map