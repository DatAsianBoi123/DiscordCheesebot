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
    .addSubcommand(subcommand => subcommand.setName('wordle').setDescription('Play a game of wordle for some money'))
    .addSubcommand(subcommand =>
      subcommand.setName('pay')
        .setDescription('Pays a user')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user to pay')
            .setRequired(true),
        )
        .addIntegerOption(option =>
          option.setName('amount')
            .setDescription('The amount to pay')
            .setMinValue(0)
            .setRequired(true),
        ),
    ),

  type: 'GLOBAL',
  permissions: {
    DMs: false,
  },

  listeners: {
    onExecute: async ({ interaction, args, user: author, subcommand }) => {
      await interaction.deferReply();

      const user = args.getUser('user') ?? author;

      const buckModel = await burgisBuckModel.model.findOne({ id: user.id }).exec() ?? await burgisBuckModel.model.create({ id: user.id, balance: 0 });

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

      case 'pay': {
        const amount = args.getInteger('amount', true);
        const payer = await burgisBuckModel.model.findOne({ id: author.id }).exec() ?? await burgisBuckModel.model.create({ id: author.id, balance: 0 });

        if (amount > payer.balance) return interaction.editReply('You do not have that much money');

        await buckModel.updateOne({ $set: { balance: buckModel.balance + amount } }).exec();
        await payer.updateOne({ $set: { balance: payer.balance - amount } }).exec();

        interaction.editReply(`Successfully gave ${user.username} ${amount} Burgis Bucks`);

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
  },
};

module.exports = command;
