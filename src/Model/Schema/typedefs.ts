import { gql } from "apollo-server-micro"
import { User, UserInput, Thread, CreateThreadInput, Follow, ActionFollowInput, CreateRepllyInput } from "@/Model/Schema/Types"

export const typeDefs = gql`
    ${Follow}
    ${User}
    ${Thread}
    type Activity {
        from  : User!
        to : String!
        action : String!
        timeStamp : String!
        thread : Thread
        threadId : String!
    }
    input ThreadInput {
        userId : String!
        page : Int!
        size : Int!
    }
   type Query {
    user (id : ID! ,userId : ID) : User
    users (name : String) : [User!]
    getThreads ( userId : String) : [Thread!]
    getHomeThreads ( page : ThreadInput! ) : [Thread!]
    activity(userId : ID!) : [Activity!]
    }
    ${CreateThreadInput}
    ${ActionFollowInput}
    ${CreateRepllyInput}
    ${UserInput}
    # follow : ID! ,followed : ID!
    input LikeInput {
        threadId : String!
        userId : String!
    }
    input UserProfileInput {
        _id : String!
        name : String 
        bio : String
        image : String
        email : String
    }
    type Mutation  {
        createThread (thread : CreateThreadInput!) : Thread
        registerUser (user : UserInput!) : User
        follow (action : ActionFollowInput!) : Boolean!
        unFollow (action : ActionFollowInput!) : Boolean!
        like(action : LikeInput! ) : Boolean!
        unLike(action : LikeInput! ) : Boolean!
        createReplly(replly : CreateRepllyInput!) : Thread
        updateProfile(update : UserProfileInput! ) : Boolean!
    }
`