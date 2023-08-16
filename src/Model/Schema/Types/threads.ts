export const Thread = `
type Thread {
    userId : String!
    threadId : String
    _id : String!
    name : String
    email : String
    image : String
    media : [String!]
    timeStamp : String!
    content : String
    thread : Thread 
    likes : Int
    replies : Thread
    liked : Boolean
}
`

export const CreateRepllyInput = `
input CreateRepllyInput {
    userId : String! 
    threadId : String! 
    content : String 
    media : [String!]
}
`
export const CreateThreadInput = `
input CreateThreadInput {
    userId : String! 
    content : String 
    media : [String!]
    threadId : String
}
`