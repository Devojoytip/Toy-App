const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const port = process.env.PORT;
const db = require('./config/mongoose');
const session = require('express-session');

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const User = require('./models/user');
const Toy = require('./models/toy');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
 
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);
app.use(jsonParser);
app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
app.use('/uploads',express.static(__dirname+'/uploads'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'toy_app',
    secret: process.env.SESSION_COOKIE_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: process.env.MONGO_URL,
            autoRemove:'disabled'
        },
        function(err)
        {
            console.log(err || 'mongodb setup is ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});