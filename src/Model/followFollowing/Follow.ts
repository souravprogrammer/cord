import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    follow: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    followedUser: {
        type: mongoose.Types.ObjectId,
        required: true,
    }
});
export const Follow = mongoose.models.follow || mongoose.model('follow', UserSchema);