const express     = require('express');
const graphqlHTTP = require('express-graphql');
const schema      = require('./schema/schema');
const mongoose    = require('mongoose');


//链接数据库
mongoose.connect('mongodb://localhost/graphql', { useNewUrlParser: true });

mongoose.connection.once('open', () => {
    console.log('connected to database');
});

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('the serve listen on prot 4000');
});


