const express = require('express')
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static('public'));
app.use(express.static('pictures'));

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
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
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
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");
const postRoute = require("./routes/posts.js");
const categoryRoute = require("./routes/categories.js");
const messageRoute = require("./routes/messages.js");
app.use(authRoute);
app.use(userRoute);
app.use(postRoute);
app.use(categoryRoute);
app.use(messageRoute);

// FILESYSTEM (Load files and combine them)
const fs = require('fs');

const navbarPage = fs.readFileSync("public/navbar/navbar.html", "utf8");
const footerPage = fs.readFileSync("public/footer/footer.html", "utf8");
const flashPage = fs.readFileSync("public/flash/flash.html", "utf8");
const modalPage = fs.readFileSync("public/modal/modal.html", "utf8");

const frontpagePage = fs.readFileSync("public/index/index.html", "utf8");
const favoritesPage = fs.readFileSync("public/favorites/favorites.html", "utf8");
const categoryPage = fs.readFileSync("public/category/category.html", "utf8");
const chatPage = fs.readFileSync("public/chat/chat.html", "utf8");
const profilePage = fs.readFileSync("public/profile/profile.html", "utf8");
const settingsPage = fs.readFileSync("public/settings/settings.html", "utf8");
const signupPage = fs.readFileSync("public/signup/signup.html", "utf8");

app.get("/", (req, res) => {

    return res.send(navbarPage + flashPage + modalPage + frontpagePage + footerPage);
});

app.get("/category/:category", (req, res) => {

    return res.send(navbarPage + flashPage + modalPage + categoryPage + footerPage);
});

app.get("/chat", (req, res) => {

    if (true) {

        return res.send(navbarPage + flashPage + chatPage + footerPage);

    } else {

        res.redirect("/");

    }
});
app.get("/chat/:recieverId", (req, res) => {

    if (true) {

        return res.send(navbarPage + flashPage + chatPage + footerPage);

    } else {

        res.redirect("/");

    }
});

app.get("/favorites", (req, res) => {
    if (req.session.isLoggedIn) {

        return res.send(navbarPage + flashPage + favoritesPage + footerPage);

    } else {

        res.redirect("/");

    }
});

app.get("/profile", (req, res) => {
    if (req.session.isLoggedIn) {

        res.redirect(`/profile/${req.session.user.username}`);

    } else {

        res.redirect("/");
    }
});

app.get("/profile/:username", (req, res) => {

    return res.send(navbarPage + flashPage + profilePage + footerPage);

});

app.get("/settings", (req, res) => {

    if (req.session.isLoggedIn) {

        return res.send(navbarPage + flashPage + settingsPage + footerPage);

    } else {

        // // So login knows what page the users was trying to access (where to redirect afterwards);
        // req.session.loginReturnTo = req.originalUrl;
        res.redirect("/");
    }

});

app.get("/signup", (req, res) => {
    if (!req.session.isLoggedIn) {

        return res.send(navbarPage + flashPage + signupPage + footerPage);

    } else {

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