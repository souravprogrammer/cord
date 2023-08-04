import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    image: {
        type: String,
    },
    bio: {
        type: String
    },
    link: {
        type: String
    },
    password: {
        type: String
    }
});
export const User = mongoose.models.user || mongoose.model('user', UserSchema); 