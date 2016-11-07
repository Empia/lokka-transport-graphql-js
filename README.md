# lokka-transport-graphql-js

Local Schema Transport Layer for [Lokka](https://github.com/kadirahq/lokka)

---

This is a transport layer for wrapping [Lokka](https://github.com/kadirahq/lokka) around your
[graphql-js](https://github.com/graphql/graphql-js) schema without going over the network.

## Basic Usage

Install the package:

```
npm i --save lokka-transport-graphql-js
npm i --save lokka
```

This is how to send request to Facebook's [SWAPI GraphQL Demo](http://graphql-swapi.parseapp.com/).

```js
import GraphqlJSTransport from 'lokka-transport-graphql-js';
import schema from './path/to/my-schema'; // A valid instance of GraphQLSchema
const transport = new GraphqlJSTransport(schema);
transport.send(`
    {
      allFilms {
        films {
          title
        }
      }
    }
`).then(response => {
    console.log(JSON.stringify(response, null, 2));
});
```

## Send context, rootValue, etc.

It's possible to send rootValue and context:

```js
const transport = new GraphqlJSTransport(schema, { rootValue: myRootValue, context: myContext });
```

## Error Handling

By default it will create and throw a new `Error` object using the first GraphQL error. Error handling can be customized with the `handleErrors` option. Check the default error handler in `lib/index.js` for an example.
