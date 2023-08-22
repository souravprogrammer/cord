export const User = `
    type User {
        name : String! 
        email : String!
        image : String
        _id : String!
        bio : String
        followers (userId : ID) : follow
        following : follow
        thread : [Thread!]
        password : String
        isFollowing (userId : ID) : Boolean!
        verified : Boolean
}
`
export const Follow = `
type follow {
    count : Int!
    users : [User!]

}`
export const UserInput = `
input UserInput {
    name : String! 
    email : String!
    password : String!
    image : String  
}
`
export const ActionFollowInput = `
input ActionFollowInput  {
    follow : String!
    followed : String!
}
`