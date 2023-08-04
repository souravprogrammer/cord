import mongoose from "mongoose";
export const RepliesSchema = new mongoose.Schema({
    threadId: {
        type: mongoose.Types.ObjectId
    },
    userId: {
        type: mongoose.Types.ObjectId
    },
    content: {
        type: String,
    },
    media: {
        type: Array<String>,
        default: []
    },
    likes: {
        type: Number,
        default: 0,
    },
    timeStamp: { type: Date, default: Date.now },

})
export const Replies = mongoose.models.replies || mongoose.model('replies', RepliesSchema); 