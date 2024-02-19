import mongoose, { Document, Schema } from 'mongoose';

interface IMessage {
    sender: Schema.Types.ObjectId;
    content: string;
    timestamp?: Date;
}

interface IConversation extends Document {
    participants: Schema.Types.ObjectId[];
    messages: IMessage[];
}

const conversationSchema = new Schema<IConversation>({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ sender: Schema.Types.ObjectId, content: String, timestamp: { type: Date, default: Date.now } }]
});

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
