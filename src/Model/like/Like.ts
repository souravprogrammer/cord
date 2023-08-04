import mongoose from "mongoose";

/**
 * 
{
    from :   oneoneUserId ,
    to : myUserId,
    action : "like/follow/comment" ,
    threadId :
    timeStamp : time
}
 * 
*/

const LikeSchema = new mongoose.Schema({
    threadId: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        require: true
    }
});
export const Like = mongoose.models.like || mongoose.model('like', LikeSchema);