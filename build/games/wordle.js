"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordleGame = void 0;
const burgerclient_1 = require("burgerclient");
const canvas_1 = require("canvas");
const discord_js_1 = require("discord.js");
const node_fetch_1 = __importDefault(require("node-fetch"));
const burgis_buck_model_1 = __importDefault(require("../models/burgis-buck-model"));
class WordleGame {
    static activeGames = new discord_js_1.Collection();
    userId;
    target;
    tileSize = 68;
    board = [];
    currentRow = 0;
    ended = false;
    started = false;
    interaction = null;
    guessedWords = [];
    availableLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    constructor(userId, word) {
        WordleGame.activeGames.set(userId, this);
        this.userId = userId;
        this.target = word;
        for (let i = 0; i < 6; i++) {
            this.board[i] = [];
            for (let j = 0; j < 5; j++) {
                this.board[i][j] = {
                    color: 'unknown',
                    letter: '',
                };
            }
        }
    }
    async start(interaction) {
        if (this.started || this.ended)
            return burgerclient_1.BurgerClient.logger.log('This game of wordle has already started, or it has ended', 'ERROR');
        burgerclient_1.BurgerClient.logger.log(`${interaction.user.username} (${this.userId}) just started a game of wordle with the answer ${this.target}`);
        this.interaction = interaction;
        this.started = true;
        const actionRows = [
            new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.ButtonBuilder().setLabel('Guess Word').setCustomId('guess').setStyle(discord_js_1.ButtonStyle.Primary))
                .addComponents(new discord_js_1.ButtonBuilder().setLabel('View Available Letters').setCustomId('viewWords').setStyle(discord_js_1.ButtonStyle.Secondary)),
            new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.ButtonBuilder().setLabel('Quit').setCustomId('quit').setStyle(discord_js_1.ButtonStyle.Danger)),
        ];
        const guessModal = new discord_js_1.ModalBuilder()
            .setTitle('Guess Word')
            .setCustomId('guessModal')
            .addComponents(new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.TextInputBuilder()
            .setMinLength(5)
            .setMaxLength(5)
            .setCustomId('guessInput')
            .setLabel('Your Guess')
            .setRequired(true)
            .setStyle(discord_js_1.TextInputStyle.Short)
            .setRequired(true)));
        const canvas = await this.generateImage();
        const wordleMessage = await interaction.editReply({ files: [canvas.toBuffer()], components: actionRows });
        const collector = wordleMessage.createMessageComponentCollector({ filter: i => i.user.id === this.userId, idle: 60000, componentType: discord_js_1.ComponentType.Button });
        collector.on('collect', async (collected) => {
            if (collected.customId === 'quit') {
                collector.stop();
                collected.reply(`${interaction.user.username} quit this game of wordle. What a clown`);
            }
            else if (collected.customId === 'viewWords') {
                collected.reply({ content: this.availableLetters.join(', '), ephemeral: true });
            }
            else if (collected.customId === 'guess') {
                await collected.showModal(guessModal);
                await collected.awaitModalSubmit({ time: 15000, filter: i => i.customId === 'guessModal' })
                    .then(async (submitted) => {
                    const guessedWord = submitted.fields.getTextInputValue('guessInput');
                    if (this.guessedWords.find(word => word.localeCompare(guessedWord, undefined, { sensitivity: 'accent' }) === 0)) {
                        await submitted.reply({ content: `You already guessed the word ${guessedWord}`, ephemeral: true });
                        return;
                    }
                    const wordData = await (0, node_fetch_1.default)(`https://api.dictionaryapi.dev/api/v2/entries/en/${guessedWord}`);
                    if (wordData.status === 404) {
                        await submitted.reply({ content: `${guessedWord} isn't a word, dummy!`, ephemeral: true });
                        return;
                    }
                    this.guessWord(guessedWord);
                    await submitted.reply({ content: `You guessed the word ${guessedWord}`, ephemeral: true });
                    const updatedCanvas = await this.generateImage();
                    await collected.editReply({ files: [updatedCanvas.toBuffer()] });
                    if (guessedWord.localeCompare(this.target, undefined, { sensitivity: 'accent' }) === 0) {
                        await this.end();
                        const gainedCoins = Math.floor(Math.random() * 50) + 50;
                        const buckModel = await burgis_buck_model_1.default.model.findOne({ id: this.userId }) ?? await burgis_buck_model_1.default.model.create({ id: this.userId, balance: 0 });
                        await buckModel.updateOne({ $set: { balance: buckModel.balance + gainedCoins } });
                        collected.followUp(`You won! Here, have ${gainedCoins} Burgis Bucks`);
                        return;
                    }
                    this.currentRow++;
                    if (this.currentRow === 6) {
                        await this.end();
                        collected.followUp(`You lost! The correct word was ${this.target}`);
                    }
                })
                    .catch(async () => {
                    await collected.followUp({ content: 'You took too long to answer', ephemeral: true });
                    return;
                });
            }
        });
        collector.on('end', async () => {
            this.end();
        });
    }
    guessWord(guess) {
        const connections = this.calculateConnections(guess);
        const newWords = guess.split('', 5);
        this.board[this.currentRow].forEach((val, i) => {
            val.letter = newWords[i];
            val.color = connections[i];
            const letterIndex = this.availableLetters.indexOf(newWords[i]);
            if (connections[i] === 'absent' && letterIndex != -1)
                this.availableLetters.splice(letterIndex, 1);
        });
        this.guessedWords.push(guess);
    }
    calculateConnections(word) {
        const connections = [];
        for (let i = 0; i < word.length; i++) {
            if (this.target[i] === word[i]) {
                connections.push('correct');
                continue;
            }
            const indexOf = this.target.indexOf(word[i]);
            if (indexOf === -1)
                connections.push('absent');
            else if (indexOf === i)
                connections.push('correct');
            else
                connections.push('present');
        }
        return connections;
    }
    async end() {
        if (!this.started || !this.interaction)
            return burgerclient_1.BurgerClient.logger.log('The wordle game hasn\'t started yet', 'WARNING');
        this.ended = true;
        WordleGame.activeGames.delete(this.userId);
        const message = await this.interaction.fetchReply();
        const components = message.components.map(row => {
            const buttons = row.components.map(component => new discord_js_1.ButtonBuilder(component.data).setDisabled(true));
            return new discord_js_1.ActionRowBuilder().setComponents(buttons);
        });
        await message.edit({ components: components });
    }
    async generateImage() {
        const calcCenter = (x, y, width, height) => {
            return [x - width / 2, y - height / 2];
        };
        const img = await (0, canvas_1.loadImage)('./assets/wordle-empty.png');
        const canvas = (0, canvas_1.createCanvas)(img.naturalWidth, img.naturalHeight);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[0].length; x++) {
                const canvasX = x * this.tileSize + this.tileSize / 2;
                const canvasY = y * this.tileSize + this.tileSize / 2 + 100;
                const size = this.tileSize * 0.9;
                const [centerX, centerY] = calcCenter(canvasX, canvasY, size, size);
                switch (this.board[y][x].color) {
                    case 'unknown':
                    case 'absent':
                        ctx.fillStyle = 'rgb(58, 58, 58)';
                        break;
                    case 'present':
                        ctx.fillStyle = '#b59f3b';
                        break;
                    case 'correct':
                        ctx.fillStyle = '#538d4e';
                        break;
                }
                if (this.board[y][x].color === 'unknown') {
                    ctx.rect(centerX, centerY, size, size);
                    ctx.rect(centerX + 2, centerY + 2, size - 4, size - 4);
                    ctx.fill('evenodd');
                }
                else {
                    ctx.fillRect(centerX, centerY, size, size);
                }
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '30px sans-serif';
                ctx.fillStyle = 'white';
                ctx.fillText(this.board[y][x].letter.toUpperCase(), canvasX, canvasY);
            }
        }
        return canvas;
    }
    static newGame(userId, word) {
        if (this.activeGames.has(userId))
            return null;
        return new WordleGame(userId, word);
    }
}
exports.WordleGame = WordleGame;
//# sourceMappingURL=wordle.js.map