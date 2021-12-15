import { Collection, Snowflake } from 'discord.js';
import { IGuildCommand } from './models/guild-command-model';

export default {
  guildCommandCache: new Collection<Snowflake, IGuildCommand>(),
};
