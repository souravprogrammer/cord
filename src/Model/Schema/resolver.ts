import { User } from "@/Model/user/User"
import { Thread } from "../thread/thread";
import { Follow } from "@/Model/followFollowing/Follow"
import { Like } from "@/Model/like/Like";
import { Replies } from "@/Model/replies/Replies"
import { Thread as Th, User as UserType } from "@/Type";
import { Activity } from "../activity/Activity";
import mongoose from "mongoose";




const getThreads = async (parent: any, args: any) => {
    const threads = await Thread.aggregate([
        {
            $match: {
                userId: args.userId
            }
        }, {
            $lookup:
            {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        }, {
            $unwind: "$user"
        }
    ])
    return threads
}

async function getHomeThreads(parent: any, arg: any) {
    // now here am getting  the threads for the user home 
    const { userId, page, size }: { userId: string, page: number, size: number } = arg.page;

    const threads: any = await Follow.aggregate([
        {
            $match: {
                follow: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:
            {
                from: "threads",
                let: {
                    followedUser: "$followedUser",
                    user: new mongoose.Types.ObjectId(userId)
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $eq: ["$userId", "$$user"] },
                                    { $eq: ["$userId", "$$followedUser"] }
                                ]
                            }
                        }
                    },
                ],
                as: "threads"
            }
        },
        {
            $unwind: "$threads"
        },
        {
            $lookup:
            {
                from: "users",
                localField: "threads.userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: "$threads._id",
                userId: "$threads.userId",
                content: "$threads.content",
                likes: "$threads.likes",
                timeStamp: "$threads.timeStamp",
                threadId: "$threads.threadId",
                media: "$threads.media",
                name: "$user.name",
                image: "$user.image",
                email: "$user.email",
                verified: "$user.verified",
            }
        },
        {
            $lookup:
            {
                from: "likes",
                let: {
                    userId: "$userId",
                    threadId: "$_id"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                                    { $eq: ["$threadId", "$$threadId"] }
                                ]
                            }
                        }
                    },
                ],
                as: "like"
            }
        },
        {
            $addFields: {
                liked: { $gt: [{ $size: "$like" }, 0] }
            }
        },
        {
            $group: {
                _id: "$_id",
                userId: { $first: "$userId" },
                content: { $first: "$content" },
                likes: { $first: "$likes" },
                timeStamp: { $first: "$timeStamp" },
                media: { $first: "$media" },
                name: { $first: "$name" },
                image: { $first: "$image" },
                email: { $first: "$email" },
                liked: { $first: "$liked" },
                threadId: { $first: "$threadId" },
                verified: { $first: "$verified" }
            }
        },
        {
            $sort: {
                _id: -1,
                // timestamp: 1 // Sort by timestamp in descending order to get the latest threads first
            }
        },
        {
            $skip: (page - 1) * size
        },
        { $limit: size },
    ]);
    return threads

}
async function activity(parent: any, args: { userId: string }) {
    return await Activity.find({
        to: new mongoose.Types.ObjectId(args.userId)
    }).sort({ timeStamp: -1 })
}
export const resolver = {
    Query: {

        getThread: async (parent: unknown, args: { threadId: string }) => {
            const threads = await Thread.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(args.threadId)
                    }
                }, {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                }, {
                    $unwind: "$user"
                },
                {
                    $lookup:
                    {
                        from: "likes",
                        let: {
                            userId: "$userId",
                            threadId: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$userId", "$userId"] },
                                            { $eq: ["$threadId", "$$threadId"] }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: "like"
                    }
                },
                {
                    $addFields: {
                        liked: { $gt: [{ $size: "$like" }, 0] }
                    }
                },
                {
                    $project: {
                        name: "$user.name",
                        email: "$user.email",
                        image: "$user.image",
                        userId: "$userId",
                        _id: "$_id",
                        threadId: "$threadId",
                        content: "$content",
                        media: "$media",
                        timeStamp: "$timeStamp",
                        likes: "$likes",
                        liked: "$liked",
                        verified: "$user.verified",

                    }
                }
            ])
            return threads.length === 1 ? threads[0] : null

        },
        users: async (parent: any, args: any) => {
            const users = await User.find({
                name: { $regex: new RegExp(args.name, "i") }
            })
            return users;
        },
        user: async function (parent: any, args: any) {
            const user = await User.findById({ _id: args.id })
            return user
        },
        getThreads: getThreads,
        getHomeThreads: getHomeThreads,
        activity: activity
    },
    Mutation: {
        createThread: async (parent: any, { thread }: { thread: Th }) => {

            try {
                const newThread = new Thread({
                    ...thread,
                })
                return await newThread.save()
            } catch (err: any) {
                return { error: err.message }
            }
        },
        follow: async function (parent: unknown, arg: { action: { follow: string, followed: string } }) {
            try {
                const follow = new Follow({
                    follow: new mongoose.Types.ObjectId(arg.action.follow),
                    followedUser: new mongoose.Types.ObjectId(arg.action.followed)
                })
                const res = await follow.save()
                const activity = new Activity({
                    from: new mongoose.Types.ObjectId(arg.action.follow),
                    to: new mongoose.Types.ObjectId(arg.action.followed),
                    action: "follow",
                })
                await activity.save()
                return true
            } catch (err: any) {
                return false

            }

        },
        unFollow: async function (parent: unknown, arg: { action: { follow: string, followed: string } }) {
            try {
                await Follow.deleteOne({ follow: arg.action.follow, followedUser: arg.action.followed })
                await Activity.deleteOne({
                    from: arg.action.follow,
                    to: arg.action.followed,
                    action: "follow"
                })
                return true
            } catch (err: any) {
                return false

            }

        },
        registerUser: async function (parent: any, arg: { user: { name: string, password: string, email: string, image?: string } }) {
            const user = new User({
                ...arg.user
            })
            const res = await user.save()
            return res
        },
        like: async function (parent: any, args: any) {

            const like = new Like({
                userId: new mongoose.Types.ObjectId(args.action.userId),
                threadId: new mongoose.Types.ObjectId(args.action.threadId)
            })
            const thread = await Thread.findOne({
                _id: new mongoose.Types.ObjectId(args.action.threadId)

            })
            const ac = Thread.updateOne({
                _id: new mongoose.Types.ObjectId(args.action.threadId)
            }, {
                $inc: { likes: 1 }
            })
            const activity = new Activity({
                from: new mongoose.Types.ObjectId(args.action.userId),
                to: new mongoose.Types.ObjectId(thread.userId),
                threadId: new mongoose.Types.ObjectId(thread._id),
                action: "like"
            })
            await Promise.allSettled([activity.save(), ac, like.save()])
            return true
        },
        unLike: async function (parent: any, args: any) {

            const unlike = Like.deleteOne({
                userId: new mongoose.Types.ObjectId(args.action.userId),
                threadId: new mongoose.Types.ObjectId(args.action.threadId)
            })
            const ac = Thread.updateOne({
                _id: new mongoose.Types.ObjectId(args.action.threadId)
            }, {
                $inc: { likes: -1 }
            })
            await Promise.allSettled([ac, unlike])
            return true

        },
        createReplly: async (parent: any, arg: { replly: any }) => {
            try {
                const replly = new Replies({ ...arg.replly })
                return await replly.save()
            } catch (err) {
                return err
            }
        },
        updateProfile: async (parent: unknown, { update }: { update: { name?: string, bio?: string, image?: string, _id: string } }) => {

            const fields: any = { ...update };
            delete fields._id
            try {
                await User.updateOne({
                    _id: new mongoose.Types.ObjectId(update._id)
                }, {
                    $set: {
                        ...fields
                    }
                })
                return true;
            } catch (err: any) {

                return false;
            }

        }
    },
    User: {
        followers: async (parent: UserType, args: any) => {
            const followers: any = await Follow.aggregate([
                {
                    $match: {
                        followedUser: new mongoose.Types.ObjectId(parent.id)
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "follow",
                        foreignField: "_id",
                        as: "users"
                    }
                },
                {
                    $unwind: "$users"
                },
                {
                    $project: {
                        name: "$users.name",
                        email: "$users.email",
                        image: "$users.image",
                        // follow: "$follow",
                        // followed: "$followedUser",
                    }
                }

            ]);
            return {
                count: followers?.length,
                users: followers
            }
        },
        following: async (parent: UserType, args: any) => {
            const following = await Follow.aggregate([
                {
                    $match: {
                        follow: new mongoose.Types.ObjectId(parent.id)
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "followedUser",
                        foreignField: "_id",
                        as: "users"
                    }
                },
            ])
            return {
                count: following?.length
            }
        },
        thread: async (parent: any, arg: {}) => {
            const threads = await Thread.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(parent._id)
                    }

                },
                {
                    $lookup:
                    {
                        from: "likes",
                        let: {
                            userId: "$userId",
                            threadId: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$userId", new mongoose.Types.ObjectId(parent._id)] },
                                            { $eq: ["$threadId", "$$threadId"] }
                                        ]
                                    }
                                }
                            },
                        ],
                        as: "like"
                    }
                },
                {
                    $addFields: {
                        liked: { $gt: [{ $size: "$like" }, 0] }
                    }
                },
            ])
            return [...threads]

        },
        isFollowing: async (parent: any, arg: any) => {
            const followUser = await Follow.findOne({

                followedUser: new mongoose.Types.ObjectId(parent.id),
                follow: new mongoose.Types.ObjectId(arg.userId)
            })
            return !!followUser;

        }
    },
    Activity: {
        from: async (parent: any) => {
            return await User.findOne({
                _id: new mongoose.Types.ObjectId(parent.from)
            })
        },
        thread: async (parent: any) => {
            return await Thread.findOne({
                _id: new mongoose.Types.ObjectId(parent.threadId)
            })

        }
    },
    Thread: {
        thread: async (parent: any, args: any) => {
            // get the nested thread here 
            const thread = await Thread.aggregate([{
                $match: {
                    _id: new mongoose.Types.ObjectId(parent.threadId)
                },
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            }, {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: "$_id",
                    userId: "$userId",
                    content: "$content",
                    likes: "$likes",
                    timeStamp: "$timeStamp",
                    media: "$media",
                    name: "$user.name",
                    image: "$user.image",
                    email: "$user.email",
                    verified: "$user.verified",
                }
            }
            ])


            return thread[0];

        }
    }

}