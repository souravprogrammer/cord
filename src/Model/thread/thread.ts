import mongoose from "mongoose";
import { RepliesSchema } from "../replies/Replies";
const ThreadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    content: {
        type: String,
    },
    thread: {
        type: Object
    },
    media: {
        type: Array<String>,
        default: []
    },
    timeStamp: { type: Date, default: Date.now },
    likes: {
        type: Number,
        default: 0,
    },
    replies: {
        type: RepliesSchema,

    }
})
export const Thread = mongoose.models.thread || mongoose.model('thread', ThreadSchema); 