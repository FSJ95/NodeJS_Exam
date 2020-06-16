const router = require("express").Router();
const User = require('../models/User.js');
const Role = require('../models/Role.js');

//BCRYPT
const bcrypt = require('bcrypt');
const saltRounds = 12;

//MULTER
const crypto = require("crypto");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "pictures/");
    },
    filename: (req, file, cb) => {
        const fileName = crypto.randomBytes(20).toString("hex");
        const mimetypeArray = file.mimetype.split("/");
        if (mimetypeArray[0] === "image") {
            const extension = mimetypeArray[mimetypeArray.length - 1];
            cb(null, fileName + "." + extension);
        } else {
            cb("Not a video error. Mimetype: " + file.mimetype);
        }
    }
});
const upload = multer({
    storage: storage
});

//NODEMAILER
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email, username, email, password) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodeauthtester@gmail.com',
            pass: 'ikkemitnormalepassword'
        }
    });

    let info = await transporter.sendMail({
        from: "NodeSocial", // sender address
        to: email, // list of receivers
        subject: "Welcome to NodeSocial", // Subject line
        text: `Welcome to NodeSocial.

You have successfully created an account.
    These are your credentials:
    Username: ${username}\n
    Email: ${email}\n
    
    Have fun :)`, // plain text body
    });
}

router.post("/signin", async (req, res) => {

    const {
        username,
        password
    } = req.body;

    //Check if fields are not null
    if (username && password) {

        try {
            // Check if the username exists in the database.
            const userObject = await User.query().findOne({
                username: username
            }).withGraphFetched('role');
            if (userObject) {

                // Check if password matches hashedPassword from database.
                const hashedPassword = userObject.password;
                bcrypt.compare(password, hashedPassword).then((result) => {

                    if (result) {
                        if (!req.session.isLoggedIn) {
                            req.session.isLoggedIn = true;
                            req.session.user = user = userObject;
                            console.log("User is successfully logged in.");
                        } else {
                            console.log("User is already logged in.");
                        }

                        // Using conditional operators to redirect to the referer otherwise the homepage.
                        const referer = req.session.loginReturnTo ? req.session.loginReturnTo : "/"
                        delete req.session.loginReturnTo;
                        req.session.flash = {
                            type: 'success',
                            message: 'You have successfully logged in!'
                        }
                        return res.redirect(referer);

                    } else {
                        req.session.flash = {
                            type: 'warning',
                            message: 'Wrong password, please try again!'
                        }
                        return res.redirect("/");

                    }
                });

            } else {
                req.session.flash = {
                    type: 'warning',
                    message: 'No user exists with that username. Please create a user if you havent already!'
                }
                return res.redirect("/");
            }

        } catch (error) {
            req.session.flash = {
                type: 'danger',
                message: 'Internal server error! Try again later.'
            }
            return res.redirect("/");
        }
    }
});


router.post("/signup", upload.single('avatar'), async (req, res) => {

    const {
        username,
        password,
        email,
        passwordRepeat
    } = req.body;

    const avatarFileName = req.file.filename ? req.file.filename : 'defaultprofilepicture.png';

    const isPasswordTheSame = password === passwordRepeat;
    console.log(isPasswordTheSame);
    if (username && password && isPasswordTheSame && email) {

        if (password.length < 8) {
            req.session.flash = {
                type: 'warning',
                message: 'Passwords does not fulfill the requirements. Please try another password.'
            }
            return res.redirect("/signup");
        } else {
            try {
                if (await User.query().findOne({
                        username: username
                    })) {
                    req.session.flash = {
                        type: 'warning',
                        message: 'An user with that username already exists. Please try another username.'
                    }
                    return res.redirect("/signup");

                } else {

                    // Find default role
                    const defaultRoles = await Role.query().select().where({
                        role: 'USER'
                    });
                    // Hash password
                    const hashedPassword = await bcrypt.hash(password, saltRounds);

                    const user = await User.query().insert({
                        username: username,
                        password: hashedPassword,
                        email: email,
                        role_id: defaultRoles[0].id,
                        avatar: avatarFileName
                    });

                    sendMail(email, username, email, password)
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.flash = {
                        type: 'success',
                        message: `User created successfully. Welcome to SocialNode, ${username}.`
                    };
                    return res.redirect("/");
                }

            } catch (error) {
                req.session.flash = {
                    type: 'danger',
                    message: 'Internal server error! Try again later.'
                }
                return res.redirect("/");
            }
        }
    } else if (password && passwordRepeat && !isPasswordTheSame) {
        req.session.flash = {
            type: 'warning',
            message: 'Passwords does not match. Please try again with the same passwords.'
        }
        return res.redirect("/signup");
    } else {
        req.session.flash = {
            type: 'warning',
            message: 'Missing one of following fields: username, email, password, passwordRepeat'
        }
        return res.redirect("/signup");
    }
});

router.get("/api/status", (req, res) => {
    // Makes any flash available in the response, then deletes it.
    res.locals.flash = req.session.flash;
    delete req.session.flash;

    var status = {
        isLoggedIn: req.session.isLoggedIn ? true : false,
        flashMessage: res.locals.flash,
        user: req.session.user
    };
    return res.send(status);
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    return res.redirect("/");
});

module.exports = router;