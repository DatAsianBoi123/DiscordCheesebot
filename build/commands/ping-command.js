"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const node_fetch_1 = __importDefault(require("node-fetch"));
const command = {
    data: new builders_1.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pings the bot'),
    type: 'GLOBAL',
    listeners: {
        onExecute: async ({ interaction }) => {
            const clientPing = Date.now() - interaction.createdTimestamp;
            let pingColor;
            if (clientPing < 50) {
                pingColor = 'Green';
            }
            else if (clientPing < 100) {
                pingColor = 'Yellow';
            }
            else {
                pingColor = 'Red';
            }
            const currentTime = Date.now();
            await (0, node_fetch_1.default)(`https://api.hypixel.net/key?key=${config_1.API_KEY}`);
            const apiPing = Date.now() - currentTime;
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('🏓 Pong!')
                .addFields({ name: 'Client Ping', value: `${clientPing}ms` }, { name: 'Hypixel API Latency', value: `${apiPing}ms` })
                .setColor(pingColor);
            interaction.reply({ embeds: [embed] });
        },
    },
};
module.exports = command;
//# sourceMappingURL=ping-command.js.map