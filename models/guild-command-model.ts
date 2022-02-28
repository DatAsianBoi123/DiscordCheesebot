import { model, Schema } from 'mongoose';

export interface IGuildCommandModel {
  id: string;
  name: string;
  description: string;
  guild_id: string;
}

const schema = new Schema<IGuildCommandModel>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  guild_id: { type: String, required: true },
}, { timestamps: true });

export default {
  model: model<IGuildCommandModel>('GuildApplicationCommand', schema),
};
