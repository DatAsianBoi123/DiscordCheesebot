import { SlashCommandBuilder } from '@discordjs/builders';
import accountLinksModel from '../models/account-links-model';
import { ICommand } from '../typings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Links a minecraft account to your discord account')
    .addStringOption(option => {
      return option.setName('name')
        .setDescription('The name of the minecraft account')
        .setRequired(true);
    }),

  type: 'GUILD',

  listeners: {
    onExecute: async ({ interaction, user, args }) => {
      interaction.deferReply({ ephemeral: true });

      await accountLinksModel.model.create({
        discord_id: user.id,
        minecraft_uuid: args.getString('name'),
      });

      interaction.editReply('Done');
    },
  },
} as ICommand;
