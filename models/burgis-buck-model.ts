import { model, Schema } from 'mongoose';

export interface IBurgisBuckModel {
  id: string;
  balance: number;
}

const schema = new Schema<IBurgisBuckModel>({
  id: { type: String, required: true },
  balance: { type: Number, required: true },
}, { timestamps: true });

export default {
  model: model<IBurgisBuckModel>('BurgisBuck', schema),
};
