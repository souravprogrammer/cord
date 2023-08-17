import { GraphQLClient } from "graphql-request";
import { QueryClient } from "react-query";
import { getSdk } from "@/generated/graphql";


// http://localhost:3000/api/ql

const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000/api/gql")

export const { getUsers, getUser,
    registerUser, createThread,
    followUser, unfollowUser,
    getHomeThreads, getActivities,
    likePost, unlike } = getSdk(gqlClient);
export const queryClient = new QueryClient({})

