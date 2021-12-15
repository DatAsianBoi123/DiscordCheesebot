import { Schema } from 'mongoose';
import mongoose from 'mongoose';

interface Command {
  id: string,
  application_id: string,
  version: string,
  default_permission: boolean,
  default_member_permissions: Record<string, unknown>,
  type: number,
  name: string,
  name_localizations: Record<string, unknown>,
  description: string,
  description_localizations: Record<string, unknown>,
  guild_id: string,
  options: Array<unknown>,
}

const commandSchema = new Schema<Command>({
  id: { type: String, required: true },
  application_id: { type: String, required: true },
  version: { type: String, required: true },
  default_permission: { type: Boolean, required: true },
  default_member_permissions: Object,
  type: { type: Number, required: true },
  name: { type: String, required: true },
  name_localizations: Object,
  description: { type: String, required: true },
  description_localizations: Object,
  guild_id: { type: String, required: true },
  options: Array,
}, {
  timestamps: true,
});

export default {
  model: mongoose.model<Command>('GuildApplicationCommand', commandSchema),
};
