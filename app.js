if( process.env.NODE_ENV !=="production" ) {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverrride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const Tshirt = require('./models/tshirt');
const Order = require('./models/order');
const User = require('./models/user');
const Successpay = require('./models/successpay');
const session = require('express-session');
const razorpay = require('razorpay');
const crypto = require("crypto");
const hmac = crypto.createHmac('sha256', '3UjwcuosRCcCmkw8ckWigoK1' );
const passport = require('passport');
const LocalStrategy = require('passport-local');
const tshirts = require('./routes/tshirts');
const { tshirtSchema } =require('./schemas.js');
const dbUrl = process.env.DB_URL;


const tshirtRoutes = require('./routes/tshirts');
const userRoutes = require('./routes/users');

const DB = 'mongodb+srv://admin:admin@cluster0.miasmqv.mongodb.net/tee_rex?retryWrites=true&w=majority';




mongoose.connect('mongodb://0.0.0.0:27017/tee-rex',{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

// mongoose.connect(DB,{
//     useNewUrlParser : true,
//     useUnifiedTopology : true,
//     // useCreateIndex:true,
//     // useFindAndModify:false
// }).then(()=> {
//     console.log(`connnection successful`);
// }).catch((err)=> console.log(err));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverrride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret : 'thisshouldbebettersecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expire : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7 
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/tshirts', tshirtRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 400));
});

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something went wrong!'
    res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
})