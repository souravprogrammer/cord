export const Thread = `
type Thread {
    userId : String!
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
export const CreateThreadInput = `
input CreateThreadInput {
    userId : String! 
    content : String 
    media : [String!]
}
`