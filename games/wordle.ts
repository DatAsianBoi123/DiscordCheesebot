import { BurgerClient } from 'burgerclient';
import { createCanvas, loadImage } from 'canvas';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Collection, ComponentType, MessageActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import fetch from 'node-fetch';
import burgisBuckModel from '../models/burgis-buck-model';
import { WordleTile } from '../typings';

export class WordleGame {
  public static readonly activeGames = new Collection<string, WordleGame>();

  private userId: string;
  private target: string;
  private tileSize = 68;
  private board: Array<Array<{ color: WordleTile; letter: string }>> = [];
  private currentRow = 0;
  private ended = false;
  private started = false;
  private interaction: ChatInputCommandInteraction | null = null;
  private guessedWords: string[] = [];
  private availableLetters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  private constructor(userId: string, word: string) {
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

  public async start(interaction: ChatInputCommandInteraction) {
    if (this.started || this.ended) return BurgerClient.logger.log('This game of wordle has already started, or it has ended', 'ERROR');

    BurgerClient.logger.log(`${interaction.user.username} (${this.userId}) just started a game of wordle with the answer ${this.target}`);

    this.interaction = interaction;
    this.started = true;

    const actionRows = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(new ButtonBuilder().setLabel('Guess Word').setCustomId('guess').setStyle(ButtonStyle.Primary))
        .addComponents(new ButtonBuilder().setLabel('View Available Words').setCustomId('viewWords').setStyle(ButtonStyle.Secondary)),
      new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(new ButtonBuilder().setLabel('Quit').setCustomId('quit').setStyle(ButtonStyle.Danger)),
    ];

    const guessModal = new ModalBuilder()
      .setTitle('Guess Word')
      .setCustomId('guessModal')
      .addComponents(new ActionRowBuilder<TextInputBuilder>()
        .addComponents(new TextInputBuilder()
          .setMinLength(5)
          .setMaxLength(5)
          .setCustomId('guessInput')
          .setLabel('Your Guess')
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
          .setRequired(true)));

    const canvas = await this.generateImage();
    const wordleMessage = await interaction.editReply({ files: [canvas.toBuffer()], components: actionRows });

    const collector = wordleMessage.createMessageComponentCollector({ filter: i => i.user.id === this.userId, idle: 60000, componentType: ComponentType.Button });

    collector.on('collect', async collected => {
      if (collected.customId === 'quit') {
        collector.stop();
        collected.reply(`${interaction.user.username} quit this game of wordle. What a clown`);
      } else if (collected.customId === 'viewWords') {
        collected.reply({ content: this.availableLetters.join(', '), ephemeral: true });
      } else if (collected.customId === 'guess') {
        await collected.showModal(guessModal);
        const submitted = await collected.awaitModalSubmit({ time: 15000, filter: i => i.customId === 'guessModal' }).catch(() => {
          collected.followUp({ content: 'You took too long to answer', ephemeral: true });
          return;
        });
        if (!submitted) return;

        const guessedWord = submitted.fields.getTextInputValue('guessInput');

        if (this.guessedWords.find(word => word.localeCompare(guessedWord, undefined, { sensitivity: 'accent' }) === 0)) {
          collected.followUp(`You already guessed the word ${guessedWord}`);
          return;
        }

        const wordData = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guessedWord}`);

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
          const buckModel = await burgisBuckModel.model.findOne({ id: this.userId }) ?? await burgisBuckModel.model.create({ id: this.userId, balance: 0 });
          await buckModel.updateOne({ $set: { balance: buckModel.balance + gainedCoins } });
          collected.followUp(`You won! Here, have ${gainedCoins} Burgis Bucks`);
          return;
        }

        this.currentRow++;

        if (this.currentRow === 6) {
          await this.end();
          collected.followUp(`You lost! The correct word was ${this.target}`);
        }
      }
    });

    collector.on('end', async () => {
      this.end();
    });
  }

  public guessWord(guess: string) {
    const connections = this.calculateConnections(guess);

    const newWords = guess.split('', 5);
    this.board[this.currentRow].forEach((val, i) => {
      val.letter = newWords[i];
      val.color = connections[i];

      if (connections[i] === 'absent') this.availableLetters.splice(this.availableLetters.indexOf(newWords[i]), 1);
    });
  }

  public calculateConnections(word: string) {
    const connections: WordleTile[] = [];

    for (let i = 0; i < word.length; i++) {
      if (this.target[i] === word[i]) {
        connections.push('correct');
        continue;
      }

      const indexOf = this.target.indexOf(word[i]);
      if (indexOf === -1) connections.push('absent');
      else if (indexOf === i) connections.push('correct');
      else connections.push('present');
    }

    return connections;
  }

  public async end() {
    if (!this.started || !this.interaction) return BurgerClient.logger.log('The wordle game hasn\'t started yet', 'WARNING');
    this.ended = true;
    WordleGame.activeGames.delete(this.userId);
    const message = await this.interaction.fetchReply();
    const components = message.components.map(row => {
      const buttons = row.components.map(component => new ButtonBuilder(component.data).setDisabled(true));
      return new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(buttons);
    });
    await message.edit({ components: components });
  }

  private async generateImage() {
    const calcCenter = (x: number, y: number, width: number, height: number) => {
      return [x - width / 2, y - height / 2];
    };

    const img = await loadImage('./assets/wordle-empty.png');
    const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
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
        } else {
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

  public static newGame(userId: string, word: string) {
    if (this.activeGames.has(userId)) return null;
    return new WordleGame(userId, word);
  }
}
