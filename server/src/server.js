// const { ApolloServer } = require('@apollo/server')
// const { startStandaloneServer } = require("@apollo/server/standalone")
// const { schema } = require('./schema')
// const { createContext } = require('./context')
// const dotenv = require('dotenv')
// const authenticate = require('./middleware/authenticate')

// dotenv.config()

// const start = async () => {
//   const server = new ApolloServer({ schema })

//   const { url } = await startStandaloneServer(server, {
//     context: createContext,
//     listen: { port: 4000 }
//   })

//   console.log(`\
//   🚀 Server ready at: ${url}
//   ⭐️ See sample queries: http://pris.ly/e/js/graphql#using-the-graphql-api
//     `)
// }

// start()



const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { schema } = require('./schema');
const { createContext } = require('./context');
const dotenv = require('dotenv');
const authenticateToken = require('../middleware/authenticate');

dotenv.config();

const start = async () => {
  const app = express();

  // Apply middleware
  app.use(authenticateToken);

  const server = new ApolloServer({
    schema, context: createContext 
  });

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT || 4000;
  app.listen({ port }, () =>
    console.log(`\
    🚀 Server ready at http://localhost:${port}${server.graphqlPath}
    ⭐️ See sample queries: http://pris.ly/e/js/graphql#using-the-graphql-api
    `)
  );
};

start();

