import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
    userId: Types.ObjectId;
    title: string;
    content: string;
}

const noteSchema = new Schema<INote>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

const Note = model<INote>('Note', noteSchema);
export default Note;
