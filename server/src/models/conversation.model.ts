import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage{
    sender: mongoose.Types.ObjectId;
    content: string;
    timestamp?: Date;
}

interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    messages: IMessage[];
}

const conversationSchema = new mongoose.Schema<IConversation>({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ sender: Schema.Types.ObjectId, content: String, timestamp: { type: Date, default: Date.now } }]
});

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
