import { gql } from "apollo-server-micro"
import { User, UserInput, Thread, CreateThreadInput, Follow, ActionFollowInput } from "@/Model/Schema/Types"

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
   
   type Query {
    user (id : ID! ,userId : ID) : User
    users (name : String) : [User!]
    getThreads ( userId : String) : [Thread!]
    getHomeThreads ( userId : String) : [Thread!]
    activity(userId : ID!) : [Activity!]
    }
    ${CreateThreadInput}
    ${ActionFollowInput}
    ${UserInput}
    # follow : ID! ,followed : ID!
    input LikeInput {
        threadId : String!
        userId : String!
    }
    type Mutation  {
        createThread (thread : CreateThreadInput!) : Thread
        registerUser (user : UserInput!) : User
        follow (action : ActionFollowInput!) : Boolean!
        unFollow (action : ActionFollowInput!) : Boolean!
        like(action : LikeInput! ) : Boolean!
        unLike(action : LikeInput! ) : Boolean!

    }
`