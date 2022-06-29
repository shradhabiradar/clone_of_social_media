const express = require('express');
const cookieParser = require('cookie-parser');
const port = 7000;
const app = express();
const expressLayout = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy')
const passportGoogle = require('./config/passport-google-oauth-strategy')
const MongoStore = require('connect-mongo');
const nodeSassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customWare = require('./config/middleware');

//set up chat server
const chatserver = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatserver);
chatserver.listen(5000);
console.log('chat server is listening on port 5000')

app.use(nodeSassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))
app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
app.use(expressLayout);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.set('view engine', 'ejs');
app.set('views', './views');


app.use(session({
    name: 'codeial',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store:  MongoStore.create({
        mongoUrl: 'mongodb://localhost/social_development',
        autoRemove: 'disabled'
    }, function(err){
        console.log(err || 'eonnected')
    })
    
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
//flash uses session cookies.
app.use(flash());
app.use(customWare.setFlash)

app.use('/', require('./routes'));
app.use('/uploads', express.static(__dirname + '/uploads'));


app.listen(port, function(err){
    if(err){
        console.log(`error in firing up the express server ${err}`);
        return;
    }
    console.log(`express is running successfully on port: ${port}`);
})