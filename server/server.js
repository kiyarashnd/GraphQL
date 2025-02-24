import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

//local mock data base :
const users = [
  { id: '1', name: 'John Doe', age: 30, isMarried: true },
  { id: '2', name: 'Jane Smith', age: 25, isMarried: false },
  { id: '3', name: 'John Doe', age: 28, isMarried: false },
];

const typeDefs = `
type Query{
    getUsers: [User]
    getUserById(id:ID!):User
}

type Mutation {
    createUser(name : String!,age:Int!,isMarried:Boolean!):User
}

type User {
id:ID
name:String
age: Int
isMarried:Boolean
}
`;

const resolvers = {
  Query: {
    getUsers: () => {
      //in real data base like mongodb here you fetch all of the document in specific collection
      return users;
    },
    getUserById: (parent, args) => {
      //parent let us access the Query
      //args allow us to access what ever we passed in inside Query like id
      const id = args.id;
      return users.find((user) => user.id === id);
    },
  },
  Mutation: {
    createUser: (parnt, args) => {
      const { name, age, isMarried } = args;
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        age,
        isMarried,
      };
      users.push(newUser);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server Running at port : ${url}`);
