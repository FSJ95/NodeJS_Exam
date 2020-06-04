const express = require('express')
const flash = require('express-flash')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('views'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// RATE LIMIT
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use("/login", limiter);
app.use("/signup", limiter);

//SESSION 
const session = require('express-session');
app.use(session({
    secret: require('./config/mysqlCredentials.js').sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// OBJECTION & KNEX
const {
    Model
} = require('objection');

const knexFile = require('./knexfile.js');
const Knex = require('knex'); // This is the libary
const knex = Knex(knexFile.development); // This is the connection

Model.knex(knex);

// ROUTES
app.use(flash());
const authRoute = require("./routes/auth.js");
const usersRoute = require("./routes/users.js");
app.use(authRoute);
app.use(usersRoute);



app.all('/test', (req, res) => {
    req.flash('success', 'This is a flash message using the express-flash module.');
    res.redirect(301, '/');
})

app.get("/", (req, res) => {
    const values = {
        isLoggedIn: req.session.isLoggedIn ? true : false,
        user: req.session.user,
        title: "home",
        expressFlash: req.flash('success')
    }

    return res.render('index/index', values);
})

app.get("/popular", (req, res) => {
    const values = {
        isLoggedIn: req.session.isLoggedIn ? true : false,
        user: req.session.user,
        title: "popular"
    }

    return res.render('popular/popular', values);
})

app.get("/favorites", (req, res) => {
    const values = {
        isLoggedIn: req.session.isLoggedIn ? true : false,
        user: req.session.user,
        title: "favorites"
    }

    return res.render('favorites/favorites', values);
})

app.get("/profile", (req, res) => {
    const values = {
        isLoggedIn: req.session.isLoggedIn ? true : false,
        user: req.session.user,
        title: "profile"
    }
    if (req.session.isLoggedIn) {
        return res.render('profile/profile', values);
      } else {
          // So login knows what page the users was trying to access (where to redirect afterwards);
        req.session.loginReturnTo = req.originalUrl;
        res.redirect("/");
      }
});

app.get("/settings", (req, res) => {
    const values = {
        isLoggedIn: req.session.isLoggedIn ? true : false,
        user: req.session.user,
        title: "settings"
    }

    return res.render('settings/settings', values);
})

app.get("/login", (req, res) => {
    const values = {
        isLoggedIn: req.session.isLoggedIn ? true : false,
        user: req.session.user,
        title: "login"
    }

    return res.render('login/login', values);
});

app.get("/signup", (req, res) => {
    const values = {
        isLoggedIn: req.session.isLoggedIn ? true : false,
        user: req.session.user,
        title: "signup"
    }
    return res.render('signup/signup', values);
});

app.get("/users", (req, res) => {
    const values = {
        isLoggedIn: req.session.isLoggedIn ? true : false,
        user: req.session.user,
        title: "users"
    }
    if (req.session.isLoggedIn) {
        return res.render('users/users', values);
      } else {
          // So login knows what page the users was trying to access (where to redirect afterwards);
        req.session.loginReturnTo = req.originalUrl;
        res.redirect("/");
      }
});

const PORT = 80;
app.listen(PORT, error => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port:", PORT)
});