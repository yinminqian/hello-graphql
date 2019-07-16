const graphql = require('graphql');
const _       = require('lodash');
const Book    = require('../model/book');
const Author  = require('../model/author');


const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

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
                // return _.find(authors, { id: parent.authorId })
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorsType = new GraphQLObjectType({
    name  : 'author',
    fields: () => ({
        id   : { type: GraphQLID },
        name : { type: GraphQLString },
        age  : { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, { authorId: parent.id })
                return Book.find({ authorId: parent.id })
            }
        }
    })
});
const RootQuery   = new GraphQLObjectType({
    name  : 'RootQueryType',
    fields: {
        book   : {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(books, { id: args.id });
                return Book.findById(args.id);
            },
        },
        author : {
            type: AuthorsType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },
        books  : {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorsType),
            resolve(parent, args) {
                return Author.find({})
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name  : 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorsType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age : { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age : args.age,
                });
                //储存进数据库
                return author.save();
            }
        },
        addBook  : {
            type: BookType,
            args: {
                name    : { type: new GraphQLNonNull(GraphQLString) },
                genre   : { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let book = new Book(args);
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query   : RootQuery,
    mutation: Mutation,
});
