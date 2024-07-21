import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
}

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

GroupSchema.index({ name: 1 });

export default mongoose.model<IGroup>('Group', GroupSchema);
