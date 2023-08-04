import mongoose from "mongoose";

/*
1)  someone started following me 
2)  someone liked my tweet / thread
3)  replied / retweet my thread

{
    from :   oneoneUserId ,
    to : myUserId,
    action : "like/follow/comment" ,
    threadId :
    timeStamp : time
}
*/
const ActivitySchema = new mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    to: {
        type: mongoose.Types.ObjectId,
        require: true

    },
    action: {
        type: String
    },
    threadId: {
        type: mongoose.Types.ObjectId,
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }


});
export const Activity = mongoose.models.activity || mongoose.model('activity', ActivitySchema);