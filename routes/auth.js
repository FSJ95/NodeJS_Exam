const router = require("express").Router();
const User = require('../models/User.js');
const Role = require('../models/Role.js');

//BCRYPT
const bcrypt = require('bcrypt');
const saltRounds = 12;

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
    from: "NodeUsers", // sender address
    to: email, // list of receivers
    subject: "Welcome to NodeUsers", // Subject line
    text: `Welcome to NodeUsers.

You have successfully created an account.
    These are your credentials:
    Username: ${username}\n
    Email: ${email}\n
    Password: ${password}\n\n
    
    Have fun :)`, // plain text body
  });
}

// AUTH ROUTES
// login - POST
// signup - POST
// logout - GET

// 1. retrieve the login details and validate from the body.
// 2. check for a user match in the database.
// 3. bcrypt compare
// 4. sessions


router.post("/signin", async (req, res) => {

    const {
        username,
        password
    } = req.body;

    //Check if fields are not null
    if (username && password) {

        try {
            // Check if the username exists in the database.
            const userObject = await User.query().findOne({username: username}).withGraphFetched('role');
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
                
                        return res.redirect(referer);

                    } else {
                        
                        return res.status(400).send({
                            response: "Wrong password."
                        });
                    }
                });

            } else {
                return res.send({
                    response: "No user exists with username."
                });
            }
 
        } catch (error) {
            return res.status(500).send({
                response: "Internal server error!"
            });
        }
    }
});


//CHeck if email already exists!
router.post("/signup", async (req, res) => {

    const {
        username,
        password,
        email,
        passwordRepeat
    } = req.body;

    const isPasswordTheSame = password === passwordRepeat;

    if (username && password && isPasswordTheSame && email) {

        if (password.length < 8) {
            return res.status(400).send({
                response: "Passwords does not fulfill the requirements"
            });
        } else {
            try {
                if (await User.query().findOne({
                        username: username
                    })) {
                    return res.status(400).send({
                        response: "User already exists"
                    });
                } else {

                    // Find default role
                    const defaultRoles = await Role.query().select().where({
                        role: 'USER'
                    });
                    // Hash password
                    const hashedPassword = await bcrypt.hash(password, saltRounds);

                    await User.query().insert({
                        username: username,
                        password: hashedPassword,
                        email: email,
                        role_id: defaultRoles[0].id
                    })

                    sendMail(email, username, email, password)
                    return res.redirect("/");
                }
                
            } catch (error) {
                return res.status(500).send({
                    response: "Internal server error!"
                });
            }
        }
    } else if (password && passwordRepeat && !isPasswordTheSame) {
        return res.status(400).send({
            response: "Passwords does not match!"
        });
    } else {
        return res.status(404).send({
            response: "Missing fields: username, email, password, passwordRepeat"
        });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(function(error) {
        if (error == null) {
            console.log("User logged out without error.");
            return res.redirect("/");
        } else {
            console.log("There was an error logging out.");
            return res.redirect("/");
        }
      })
});

module.exports = router;