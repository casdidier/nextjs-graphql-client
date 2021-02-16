import { ApolloServer, gql } from "apollo-server-micro";
import Cors from "micro-cors";
const bcrypt = require('bcryptjs');

const models = require('../../models')

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
      async user (root, { id }, { models }) {
            return models.User.findById(id)
      },
      async allRecipes (root, args, { models }) {
            return models.Recipe.findAll()
      },
      async recipe (root, { id }, { models }) {
            return models.Recipe.findById(id)
      }
    },
  Mutation: {
    async createUser (root, { name, email, password }, { models }) {
        return models.User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10)
          })
    },
    async createRecipe (root, { userId, title, ingredients, direction }, { models }) {
        return models.Recipe.create({ userId, title, ingredients, direction })
    }
  },
  User: {
    async recipes (user) {
        return user.getRecipes()
    }
  },
  Recipe: {
    async user (recipe) {
        return recipe.getUser()
    }
  }
}


const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models }
});

const handler = apolloServer.createHandler({ path: "/api/hello" });

export const config = {
  api: {
    bodyParser: false
  }
};

export default cors(handler);
