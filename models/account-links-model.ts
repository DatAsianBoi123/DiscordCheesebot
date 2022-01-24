import { model, Schema } from 'mongoose';

export interface IAccountLinkModel {
  minecraft_uuid: string;
  discord_id: string;
}

const schema = new Schema<IAccountLinkModel>({
  minecraft_uuid: { type: String, required: true },
  discord_id: { type: String, required: true },
}, { timestamps: true });

export default {
  model: model<IAccountLinkModel>('AccountLink', schema),
};
