"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const burgis_buck_model_1 = __importDefault(require("../models/burgis-buck-model"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const wordle_1 = require("../games/wordle");
const command = {
    data: new builders_1.SlashCommandBuilder()
        .setName('burgisbucks')
        .setDescription('All burgis buck related commands')
        .addSubcommand(subcommand => subcommand.setName('bal')
        .setDescription('Displays a user\'s current balance')
        .addUserOption(option => option.setName('user')
        .setDescription('The user the command is directed towards')
        .setRequired(false)))
        .addSubcommand(subcommand => subcommand.setName('wordle').setDescription('Play a game of wordle for some money'))
        .addSubcommand(subcommand => subcommand.setName('pay')
        .setDescription('Pays a user')
        .addUserOption(option => option.setName('user')
        .setDescription('The user to pay')
        .setRequired(true))
        .addIntegerOption(option => option.setName('amount')
        .setDescription('The amount to pay')
        .setMinValue(0)
        .setRequired(true))),
    type: 'GLOBAL',
    permissions: {
        DMs: false,
    },
    listeners: {
        onExecute: async ({ interaction, args, user: author, subcommand }) => {
            await interaction.deferReply();
            const user = args.getUser('user') ?? author;
            const buckModel = await burgis_buck_model_1.default.model.findOne({ id: user.id }).exec() ?? await burgis_buck_model_1.default.model.create({ id: user.id, balance: 0 });
            switch (subcommand) {
                case 'bal': {
                    const embed = new discord_js_1.EmbedBuilder()
                        .setTitle(user.username)
                        .addFields({ name: 'Balance', value: buckModel.balance.toString() })
                        .setTimestamp()
                        .setColor('Orange');
                    interaction.editReply({ embeds: [embed] });
                    break;
                }
                case 'pay': {
                    const amount = args.getInteger('amount', true);
                    const payer = await burgis_buck_model_1.default.model.findOne({ id: author.id }).exec() ?? await burgis_buck_model_1.default.model.create({ id: author.id, balance: 0 });
                    if (amount > payer.balance)
                        return interaction.editReply('You do not have that much money');
                    await buckModel.updateOne({ $set: { balance: buckModel.balance + amount } }).exec();
                    await payer.updateOne({ $set: { balance: payer.balance - amount } }).exec();
                    interaction.editReply(`Successfully gave ${user.username} ${amount} Burgis Bucks`);
                    break;
                }
                case 'wordle': {
                    const words = (await (await (0, node_fetch_1.default)('https://random-word-api.herokuapp.com/word?length=5&number=5')).json());
                    let index = 0;
                    let isAWord = await (0, node_fetch_1.default)(`https://api.dictionaryapi.dev/api/v2/entries/en/${words[index]}`);
                    while (isAWord.status === 404 && index < 10) {
                        index++;
                        isAWord = await (0, node_fetch_1.default)(`https://api.dictionaryapi.dev/api/v2/entries/en/${words[index]}`);
                    }
                    if (isAWord.status === 404)
                        return interaction.editReply('Could not find word. Try again later');
                    const game = wordle_1.WordleGame.newGame(author.id, words[index]);
                    if (!game)
                        return interaction.editReply('You have already started a game of wordle');
                    await game.start(interaction);
                    break;
                }
            }
        },
    },
};
module.exports = command;
//# sourceMappingURL=burgis-bucks-command.js.map