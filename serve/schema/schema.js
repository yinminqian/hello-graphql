const graphql = require('graphql');
const _       = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt } = graphql;

const books   = [
    { name: "算法导论", genre: "计算机科学", id: "1", authorId: "1" },
    { name: "人性的弱点", genre: "社交", id: "2", authorId: "3" },
    { name: "明朝那些事儿", genre: "历史", id: "3", authorId: "2" }
];
const authors = [
    { name: "hfpp2012", age: 27, id: "1" },
    { name: "rails365", age: 30, id: "2" },
    { name: "lili", age: 21, id: "3" }
];

const BookType = new GraphQLObjectType({
    name  : 'Book',
    fields: () => ({
        id    : { type: GraphQLID },
        name  : { type: GraphQLString },
        genre : { type: GraphQLString },
        author: {
            type: AuthorsType,
            resolve(parent, args) {
                return _.find(authors, { id: parent.authorId })
            }
        }
    })
});

const AuthorsType = new GraphQLObjectType({
    name  : 'author',
    fields: () => ({
        id  : { type: GraphQLID },
        name: { type: GraphQLString },
        age : { type: GraphQLInt },
    })
});
const RootQuery   = new GraphQLObjectType({
    name  : 'RootQueryType',
    fields: {
        book  : {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(books, { id: args.id });
            },
        },
        author: {
            type: AuthorsType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(authors, { id: args.id });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
