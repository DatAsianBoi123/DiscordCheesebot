"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const account_links_model_1 = __importDefault(require("../models/account-links-model"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const command = {
    data: new builders_1.SlashCommandBuilder()
        .setName('link')
        .setDescription('Links a minecraft account to your discord account')
        .addStringOption(option => {
        return option.setName('name')
            .setDescription('The name of the minecraft account')
            .setRequired(true);
    }),
    type: 'GLOBAL',
    listeners: {
        onExecute: async ({ interaction, user, args }) => {
            await interaction.deferReply();
            const mojangData = await (0, node_fetch_1.default)(`https://api.mojang.com/users/profiles/minecraft/${args.getString('name')}`);
            if (mojangData.status === 204) {
                await interaction.editReply(`The player ${args.getString('name')} was not found`);
                return;
            }
            const mojangJSON = await mojangData.json();
            const hypixelData = await (0, node_fetch_1.default)(`https://api.hypixel.net/player?uuid=${mojangJSON.id}&key=${config_1.API_KEY}`);
            const hypixelJSON = await hypixelData.json();
            if (!hypixelJSON.success) {
                const errorEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle('Error')
                    .setDescription(`Code: **${hypixelData.status}**\nReason: ${hypixelJSON.cause}`)
                    .setColor('Red');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }
            if (!hypixelJSON.player) {
                await interaction.editReply('This player has never joined hypixel');
                return;
            }
            if (hypixelJSON.player.socialMedia?.links?.DISCORD !== user.tag) {
                await interaction.editReply('That hypixel account is not linked with your discord account!');
                return;
            }
            await account_links_model_1.default.model.updateOne({ discord_id: user.id }, {
                discord_id: user.id,
                minecraft_uuid: mojangJSON.id,
            }, { upsert: true });
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('Success!')
                .setDescription(`Successfully linked your discord account with the minecraft account ${mojangJSON.name}`)
                .setFooter({ text: `Minecraft UUID: ${mojangJSON.id}, Discord ID: ${user.id}` })
                .setTimestamp()
                .setColor('Green');
            interaction.editReply({ embeds: [embed] });
        },
    },
};
module.exports = command;
//# sourceMappingURL=link-command.js.map