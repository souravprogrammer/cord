import { GraphQLClient } from "graphql-request";
import { QueryClient } from "react-query";
import { getSdk } from "@/generated/graphql";

const gqlClient = new GraphQLClient("http://localhost:3000/api/ql")

export const { getUsers, getUser,
    registerUser, createThread,
    followUser, unfollowUser,
    getHomeThreads, getActivities,
    likePost, unlike } = getSdk(gqlClient);
export const queryClient = new QueryClient({})

