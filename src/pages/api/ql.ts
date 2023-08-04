import type { NextApiRequest, NextApiResponse } from 'next'
import { ApolloServer } from 'apollo-server-micro'
// import { ApolloServer } from "@apollo/server";
import dbConnect from '@/lib/MongoClient';

import { resolver, typeDefs } from '@/Model/Schema';
// import { schema } from "@/Model/graphQl/RootQuery"


const server = new ApolloServer({
    // schema
    typeDefs: typeDefs,
    resolvers: resolver
})
const startSever = server.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await startSever
    await dbConnect()
    await server.createHandler({ path: "/api/ql", })(req, res)

}
export const config = {
    api: {
        bodyParser: false,
    }
}