import LokkaTransport from 'lokka/transport';
import { graphql } from 'graphql';

// the default error handler
function handleErrors(errors, data) {
  const message = errors[0].message;
  const error = new Error(`GraphQL Error: ${message}`);
  error.rawError = errors;
  error.rawData = data;
  throw error;
}

export class Transport extends LokkaTransport {
  constructor(schema, options = {}) {
    if (!schema) {
      throw new Error('schema is required!');
    }

    super();
    this.schema = schema;
    this.options = options;
    this.handleErrors = options.handleErrors || handleErrors;
  }

  send(query, variables, operationName) {
    return graphql(
      this.schema,
      query,
      this.options.rootValue,
      this.options.context,
      variables,
      operationName
    ).then(({data, errors}) => {
      if (errors) {
        this.handleErrors(errors, data);
        return null;
      }

      return data;
    });
  }
}

export default Transport;
