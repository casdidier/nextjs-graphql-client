// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApolloServer, gql } from "apollo-server-micro";
import Cors from "micro-cors";

const cors = Cors({
  allowMethods: ["POST", "OPTIONS"]
});

const typeDefs = gql`
    type User {
        id: Int!
        name: String!
        email: String!
        recipes: [Recipe!]!
      }

    type Recipe {
        id: Int!
        title: String!
        ingredients: String!
        direction: String!
        user: User!
    }

    type Query {
        user(id: Int!): User
        allRecipes: [Recipe!]!
        recipe(id: Int!): Recipe
    }

    type Mutation {
        createUser(name: String!, email: String!, password: String!): User!
        createRecipe(
          userId: Int!
          title: String!
          ingredients: String!
          direction: String!
        ): Recipe!
    }
`

const resolvers = {
  Query: {
    hello: (_parent, _args, _context) => "Hello!"
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return {};
  }
});

const handler = apolloServer.createHandler({ path: "/api/hello" });

export const config = {
  api: {
    bodyParser: false
  }
};

export default cors(handler);
