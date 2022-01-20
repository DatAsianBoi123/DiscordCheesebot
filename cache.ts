import { Collection, Snowflake } from 'discord.js';
import { IGuildCommandModel } from './models/guild-command-model';

export default {
  guildCommandCache: new Collection<Snowflake, IGuildCommandModel>(),
};
