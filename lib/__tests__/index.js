import {describe, it} from 'mocha';
import {expect} from 'chai';
import LokkaGraphqlJSTransport from '../';
import Schema from './sample_schema';

describe('LokkaGraphqlJSTransport', () => {
  it('should be able to require normally', () => {
    expect(require('../').Transport).to.be.equal(LokkaGraphqlJSTransport);
  });

  describe('constructor()', () => {
    describe('without a schema', () => {
      it('should throw an error', () => {
        expect(() => new LokkaGraphqlJSTransport()).to.throw(/schema is required!/);
      });
    });

    describe('with an endpoint', () => {
      it('should create an instance', () => {
        const transport = new LokkaGraphqlJSTransport(Schema);
        expect(transport.schema).to.be.equal(Schema);
      });
    });
  });

  describe('send()', () => {
    describe('with a correct graphql query', () => {
      it('should return the result', async () => {
        const transport = new LokkaGraphqlJSTransport(Schema);
        const result = await transport.send(`
          {
            echo(message: "Hello")
          }
        `);

        expect(result).to.be.deep.equal({
          echo: 'Echo: Hello'
        });
      });
    });

    describe('with an incorrect graphql query', () => {
      it('should return the error', async () => {
        const transport = new LokkaGraphqlJSTransport(Schema);
        try {
          await transport.send(`
            {
              echo(messa: "Hello")
            }
          `);
          throw new Error('Some Other Error');
        } catch (err) {
          expect(err.message).to.match(/GraphQL Error:/);
          expect(err.rawError).to.be.instanceOf(Array);
        }
      });
    });

    describe('with an invalid schema', () => {
      it('should return the error', async () => {
        const transport = new LokkaGraphqlJSTransport({});
        try {
          await transport.send(`
            {
              echo(messa: "Hello")
            }
          `);
          throw new Error('Some Other Error');
        } catch (err) {
          expect(err.message).to.match(/Schema must be an instance of GraphQLSchema./);
        }
      });
    });
  });
});
