import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import burgisBuckModel from '../models/burgis-buck-model';
import { ICommand } from 'burgerclient';
import fetch from 'node-fetch';
import { WordleGame } from '../games/wordle';

const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('burgisbucks')
    .setDescription('All burgis buck related commands')
    .addSubcommand(subcommand =>
      subcommand.setName('bal')
        .setDescription('Displays a user\'s current balance')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user the command is directed towards')
            .setRequired(false),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand.setName('set')
        .setDescription('Sets a user\'s burgis bucks to an amount')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user the command is directed towards')
            .setRequired(true),
        )
        .addIntegerOption(option =>
          option.setName('amount')
            .setDescription('The amount to set by')
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand.setName('operation')
        .setDescription('Performs an operation on a user')
        .addStringOption(option =>
          option.setName('operation')
            .setDescription('The operation')
            .addChoices({
              name: 'add',
              value: 'ADD',
            }, {
              name: 'subtract',
              value: 'SUBTRACT',
            })
            .setRequired(true),
        )
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user')
            .setRequired(true),
        )
        .addIntegerOption(option =>
          option.setName('amount')
            .setDescription('The amount')
            .setRequired(true),
        ),
    )
    .addSubcommand(option => option.setName('wordle').setDescription('Play a game of wordle for some money')),

  type: 'GLOBAL',
  permissions: {
    DMs: false,
  },

  listeners: {
    onExecute: async ({ interaction, args, user: author, subcommand }) => {
      await interaction.deferReply();

      const user = args.getUser('user') ?? author;
      const buckModel = await burgisBuckModel.model.findOne({ id: user.id }) ?? await burgisBuckModel.model.create({ id: user.id, balance: 0 });

      switch (subcommand) {
      case 'bal': {
        const embed = new EmbedBuilder()
          .setTitle(user.username)
          .addFields({ name: 'Balance', value: buckModel.balance.toString() })
          .setTimestamp()
          .setColor('Orange');

        interaction.editReply({ embeds: [embed] });

        break;
      }

      case 'wordle': {
        const words: string = (await (await fetch('https://random-word-api.herokuapp.com/word?length=5&number=5')).json());
        let index = 0;
        let isAWord = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${words[index]}`);

        while (isAWord.status === 404 && index < 10) {
          index++;
          isAWord = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${words[index]}`);
        }

        if (isAWord.status === 404) return interaction.editReply('Could not find word. Try again later');

        const game = WordleGame.newGame(author.id, words[index]);

        if (!game) return interaction.editReply('You have already started a game of wordle');

        await game.start(interaction);

        break;
      }
      }
    },
    onError: ({ error, interaction }) => {
      interaction.editReply('An error ocurred');
      throw error;
    },
  },
};

module.exports = command;
